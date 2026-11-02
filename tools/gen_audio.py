"""Ravi film audio via local ComfyUI: Gooya Bozorg Persian TTS per scene line, ACE-Step 1.5 XL music bed.

  python tools/gen_audio.py tts 4242 7777     # one take per line per seed -> video/assets/vo_gooya/<seed>/<id>.flac
  python tools/gen_audio.py music 150 11 22   # instrumental bed of N seconds per seed -> video/assets/music/
"""
import json, os, shutil, sys, time, urllib.parse, urllib.request

API = "http://127.0.0.1:8188"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "video")
OUT_DIR = r"C:\Users\hsar72\AppData\Local\Comfy-Desktop\ComfyUI-Shared\output"

MUSIC_TAGS = (
    "cinematic electronic documentary score, instrumental, no vocals, 100 BPM, D minor, "
    "opens with a tense minimal ticking pulse and deep sub bass, glitchy granular textures, "
    "a subtle Persian santur motif, gradually builds with driving drums and warm analog synths, "
    "rises to a hopeful uplifting climax with strings, clean modern mix, ends on a resolved chord"
)


def post(prompt):
    req = urllib.request.Request(f"{API}/prompt", json.dumps({"prompt": prompt}).encode(), {"Content-Type": "application/json"})
    pid = json.load(urllib.request.urlopen(req))["prompt_id"]
    while True:
        hist = json.load(urllib.request.urlopen(f"{API}/history/{pid}"))
        if pid in hist:
            st = hist[pid]["status"]
            if st.get("status_str") == "error":
                sys.exit(json.dumps(st["messages"], ensure_ascii=False)[:2000])
            return [f for o in hist[pid]["outputs"].values() for f in o.get("audio", [])]
        time.sleep(3)


def fetch(f, dst):
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    qs = urllib.parse.urlencode({"filename": f["filename"], "subfolder": f.get("subfolder", ""), "type": f.get("type", "output")})
    with urllib.request.urlopen(f"{API}/view?{qs}") as r, open(dst, "wb") as o:
        shutil.copyfileobj(r, o)
    print("saved", dst, flush=True)


def tts(seed):
    script = json.load(open(os.path.join(ROOT, "script.json"), encoding="utf-8"))
    for s in script:
        g = {
            "tts": {"class_type": "GooyaBozorgTTS", "inputs": {
                "text": s["fa"], "seed": seed, "exaggeration": 0.4, "cfg_weight": 0.35, "language": "Persian",
                "temperature": 0.65, "repetition_penalty": 1.2, "min_p": 0.05, "top_p": 1.0}},
            "save": {"class_type": "SaveAudio", "inputs": {"audio": ["tts", 0], "filename_prefix": f"audio/ravi/{seed}_{s['id']}"}},
        }
        f = post(g)[0]
        fetch(f, os.path.join(ROOT, "assets", "vo_gooya", str(seed), s["id"] + os.path.splitext(f["filename"])[1]))


def music(seconds, seed):
    g = {
        "unet": {"class_type": "UNETLoader", "inputs": {"unet_name": "acestep_v1.5_xl_turbo_bf16.safetensors", "weight_dtype": "default"}},
        "msa": {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": ["unet", 0], "shift": 3}},
        "clip": {"class_type": "DualCLIPLoader", "inputs": {"clip_name1": "qwen_0.6b_ace15.safetensors", "clip_name2": "qwen_4b_ace15.safetensors", "type": "ace", "device": "default"}},
        "vae": {"class_type": "VAELoader", "inputs": {"vae_name": "ace_1.5_vae.safetensors"}},
        "enc": {"class_type": "TextEncodeAceStepAudio1.5", "inputs": {
            "clip": ["clip", 0], "tags": MUSIC_TAGS, "lyrics": "[Instrumental]", "seed": seed, "bpm": 100, "duration": seconds,
            "timesignature": "4", "language": "en", "keyscale": "D minor", "generate_audio_codes": True,
            "cfg_scale": 2.0, "temperature": 0.85, "top_p": 0.9, "top_k": 0, "min_p": 0.0}},
        "latent": {"class_type": "EmptyAceStep1.5LatentAudio", "inputs": {"seconds": seconds, "batch_size": 1}},
        "neg": {"class_type": "ConditioningZeroOut", "inputs": {"conditioning": ["enc", 0]}},
        "ks": {"class_type": "KSampler", "inputs": {
            "model": ["msa", 0], "positive": ["enc", 0], "negative": ["neg", 0], "latent_image": ["latent", 0],
            "seed": seed, "steps": 8, "cfg": 1, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "dec": {"class_type": "VAEDecodeAudio", "inputs": {"samples": ["ks", 0], "vae": ["vae", 0]}},
        "save": {"class_type": "SaveAudioAdvanced", "inputs": {"audio": ["dec", 0], "filename_prefix": f"audio/ravi/music_{seed}", "format": "mp3", "format.quality": "V0"}},
    }
    f = post(g)[0]
    fetch(f, os.path.join(ROOT, "assets", "music", f"bed_{seed}.mp3"))


if __name__ == "__main__":
    if sys.argv[1] == "tts":
        for s in sys.argv[2:]:
            tts(int(s))
    elif sys.argv[1] == "music":
        for s in sys.argv[3:]:
            music(float(sys.argv[2]), int(s))
