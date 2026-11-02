"""Tiny ComfyUI client for MiniMax H3 (i2v / ref2v + keyframe guides) and ACE-Step music.

Shot spec (JSON):
{
  "name": "s03-jump", "prompt": "...", "seconds": 5, "seed": 1,
  "mode": "i2v" | "ref",
  "first": "path.png", "last": "path.png",          # i2v only
  "refs": ["char_a.png", ...],                       # ref mode: <Picture 1..n>
  "guides": [["path.png", 0], ["path.png", -1]],     # anchor frames (any mode)
  "quality": "turbo4" | "turbo8" | "full",
  "out": "dir"
}
"""
import json, os, sys, time, uuid, urllib.request, urllib.parse, shutil

HOST = "http://127.0.0.1:8188"
W, H = 1344, 768


def _post(path, data):
    req = urllib.request.Request(HOST + path, data=json.dumps(data).encode(), headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req))


def upload(path):
    name = "ravi_" + os.path.basename(path)
    boundary = uuid.uuid4().hex
    body = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"{name}\"\r\nContent-Type: image/png\r\n\r\n".encode()
        + open(path, "rb").read()
        + f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"overwrite\"\r\n\r\ntrue\r\n--{boundary}--\r\n".encode()
    )
    req = urllib.request.Request(HOST + "/upload/image", data=body, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    return json.load(urllib.request.urlopen(req))["name"]


def frames(seconds):
    n = max(5, round(seconds * 24))
    return n + (5 - n % 17) % 17


def h3_graph(spec):
    g = {}
    nid = [0]

    def add(cls, **inputs):
        nid[0] += 1
        k = str(nid[0])
        g[k] = {"class_type": cls, "inputs": inputs}
        return k

    def img(path):
        return [add("LoadImage", image=upload(path)), 0]

    mode = spec.get("mode", "i2v")
    q = spec.get("quality", "turbo8")
    unet = "minimax_h3_ref2va_pruned_int8_convrot.safetensors" if mode == "ref" else "minimax_h3_fl2va_pruned_int8_convrot.safetensors"
    model = [add("UNETLoader", unet_name=unet, weight_dtype="default"), 0]
    if q != "full":
        lora = {
            ("i2v", "turbo4"): "minimax_h3_fl2v_turbo_4step_v1.0_768p_comfyui_bf16.safetensors",
            ("i2v", "turbo8"): "minimax_h3_fl2v_turbo_8step_v1.0_comfyui_bf16.safetensors",
            ("ref", "turbo4"): "minimax_h3_ref2v_turbo_4step_v0.1_comfyui_bf16.safetensors",
            ("ref", "turbo8"): "minimax_h3_ref2v_turbo_4step_v0.1_comfyui_bf16.safetensors",
        }[(mode, q)]
        model = [add("LoraLoaderModelOnly", lora_name=lora, strength_model=1.0, model=model), 0]
    steps = spec.get("steps") or {"turbo4": 4, "turbo8": 8, "full": 20}[q]
    if mode == "ref" and q != "full":
        steps = spec.get("steps") or 4
    clip = [add("CLIPLoader", clip_name="qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors", type="minimax", device="default"), 0]
    vae = [add("VAELoader", vae_name="minimax_h3_video_vae_fp16.safetensors"), 0]
    avae = [add("VAELoader", vae_name="minimax_h3_audio_vae_fp32.safetensors"), 0]
    length = frames(spec.get("seconds", 5))
    if mode == "ref":
        ins = dict(clip=clip, vae=vae, audio_vae=avae, prompt=spec["prompt"], width=spec.get("w", W), height=spec.get("h", H), length=length,
                   ref_image_size=spec.get("ref_size", "match"))
        for i, r in enumerate(spec.get("refs", []), 1):
            ins[f"ref_images.ref_image_{i}"] = img(r)
        cond = add("MiniMaxH3ReferenceToVideo", **ins)
    else:
        ins = dict(clip=clip, vae=vae, prompt=spec["prompt"], width=spec.get("w", W), height=spec.get("h", H), length=length)
        if spec.get("first"):
            ins["first_frame"] = img(spec["first"])
        if spec.get("last"):
            ins["last_frame"] = img(spec["last"])
        cond = add("MiniMaxH3ImageToVideo", **ins)
    pos, lat = [cond, 0], [cond, 1]
    for path, idx in spec.get("guides", []):
        pos = [add("MiniMaxH3AddGuide", positive=pos, latent=lat, frame_idx=idx, vae=vae, image=img(path)), 0]
    noise = add("RandomNoise", noise_seed=spec.get("seed", 1))
    guider = add("BasicGuider", model=model, conditioning=pos)
    sampler = add("KSamplerSelect", sampler_name="res_multistep")
    sig = add("BasicScheduler", scheduler="simple", denoise=1.0, model=model, steps=steps)
    s = add("SamplerCustomAdvanced", noise=[noise, 0], guider=[guider, 0], sampler=[sampler, 0], sigmas=[sig, 0], latent_image=lat)
    v = add("VAEDecode", samples=[s, 0], vae=vae)
    a = add("VAEDecodeAudio", samples=[s, 0], vae=avae)
    cv = add("CreateVideo", fps=24.0, bit_depth=8, color_space="sRGB", images=[v, 0], audio=[a, 0])
    add("SaveVideo", filename_prefix="ravi/" + spec["name"], format="auto", video=[cv, 0], **{"format.codec": "auto"})
    return g


def run(graph, out_dir, name, ext_ok=(".mp4", ".flac", ".mp3", ".png")):
    pid = _post("/prompt", {"prompt": graph, "client_id": "claude"})["prompt_id"]
    t0 = time.time()
    while True:
        time.sleep(5)
        h = json.load(urllib.request.urlopen(f"{HOST}/history/{pid}"))
        if pid in h:
            st = h[pid]["status"]
            if st.get("status_str") == "error":
                print("ERROR", json.dumps(st)[:2000]); return None
            if st.get("completed"):
                break
    os.makedirs(out_dir, exist_ok=True)
    saved = []
    for node in h[pid]["outputs"].values():
        for key in ("images", "videos", "audio", "gifs"):
            for f in node.get(key, []):
                if not f["filename"].endswith(ext_ok):
                    continue
                qs = urllib.parse.urlencode({"filename": f["filename"], "subfolder": f.get("subfolder", ""), "type": f.get("type", "output")})
                dst = os.path.join(out_dir, name + os.path.splitext(f["filename"])[1])
                with urllib.request.urlopen(f"{HOST}/view?{qs}") as r, open(dst, "wb") as o:
                    shutil.copyfileobj(r, o)
                saved.append(dst)
    print(f"DONE {name} {time.time()-t0:.0f}s -> {saved}")
    return saved


def seedvr_graph(spec):
    """SeedVR2 3B one-step video restore/upscale (Comfy template utility_seedvr2_3b_int8_upscale_video, flattened)."""
    g = {}
    nid = [0]

    def add(cls, **inputs):
        nid[0] += 1
        g[str(nid[0])] = {"class_type": cls, "inputs": inputs}
        return str(nid[0])

    vid = add("LoadVideo", file=upload(spec["upscale"]))
    comp = add("GetVideoComponents", video=[vid, 0])
    rs = add("ResizeImageMaskNode", input=[comp, 0], scale_method="lanczos",
             **{"resize_type": "scale width", "resize_type.width": spec.get("width", 1104)})
    pre = add("SeedVR2Preprocess", resized_images=[rs, 0])
    vae = add("VAELoader", vae_name="seedvr2_ema_vae_fp16.safetensors")
    unet = add("UNETLoader", unet_name=spec.get("unet", "seedvr2_3b_int8_convrot.safetensors"), weight_dtype="default")
    enc = add("VAEEncodeTiled", pixels=[pre, 0], vae=[vae, 0], tile_size=512, overlap=128, temporal_size=64, temporal_overlap=8)
    cond = add("SeedVR2Conditioning", model=[unet, 0], vae_conditioning=[enc, 0])
    ks = add("KSampler", model=[unet, 0], positive=[cond, 0], negative=[cond, 1], latent_image=[enc, 0], seed=spec.get("seed", 1),
             steps=1, cfg=1.0, sampler_name="euler", scheduler="simple", denoise=1.0)
    dec = add("VAEDecodeTiled", samples=[ks, 0], vae=[vae, 0], tile_size=512, overlap=128, temporal_size=64, temporal_overlap=8)
    post = add("SeedVR2PostProcessing", images=[dec, 0], original_resized_images=[rs, 0], color_correction_method="lab")
    cv = add("CreateVideo", images=[post, 0], fps=24.0, bit_depth=8, color_space="sRGB")
    add("SaveVideo", video=[cv, 0], filename_prefix="ravi/up/" + spec["name"], format="auto", **{"format.codec": "auto"})
    return g


def ace_graph(spec):
    tpl = json.load(open(os.path.join(os.path.dirname(__file__), "..", "ace_api_template.json")))
    t = tpl["94"]["inputs"]
    t.update(tags=spec["tags"], lyrics=spec.get("lyrics", ""), bpm=spec.get("bpm", 120), duration=float(spec["seconds"]),
             language=spec.get("language", "en"), keyscale=spec.get("key", "E minor"))
    for k in ("cfg_scale", "temperature"):
        if k in spec:
            t[k] = spec[k]
    tpl["98"]["inputs"]["seconds"] = float(spec["seconds"])
    tpl["109"]["inputs"]["value"] = spec.get("seed", 0)
    tpl["3"]["inputs"]["steps"] = spec.get("steps", 8)
    tpl["111"]["inputs"]["filename_prefix"] = "ravi/music/" + spec["name"]
    return tpl


if __name__ == "__main__":
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    specs = spec if isinstance(spec, list) else [spec]
    for sp in specs:
        out = sp.get("out", os.path.dirname(os.path.abspath(sys.argv[1])))
        if sp.get("skip_existing") and any(os.path.exists(os.path.join(out, sp["name"] + e)) for e in (".mp4", ".flac")):
            continue
        g = ace_graph(sp) if "tags" in sp else seedvr_graph(sp) if "upscale" in sp else h3_graph(sp)
        run(g, out, sp["name"])
