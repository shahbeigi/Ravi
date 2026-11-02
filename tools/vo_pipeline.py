"""Persian VO pipeline: sentence-level Gooya takes cloned from one self-reference, Whisper-picked, assembled with designed pauses.

  python tools/vo_pipeline.py ref        # 6 reference candidates -> pick the clearest -> ComfyUI input/ravi_ref.wav
  python tools/vo_pipeline.py takes 4    # N takes per sentence (cloned from ravi_ref.wav) -> work/vo_v2/takes/
  python tools/vo_pipeline.py pick       # Whisper CER + pace score -> work/vo_v2/picks.json
  python tools/vo_pipeline.py assemble   # pauses + loudnorm -> video/assets/vo_norm/v2/<id>.wav
"""
import difflib, glob, json, os, re, shutil, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_audio import fetch, post

PROJ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
WORK = os.path.join(PROJ, "work", os.environ.get("VO_WORK", "vo_v2"))
OUT_NAME = os.environ.get("VO_OUT", "v2")
COMFY_IN = r"C:\Users\hsar72\AppData\Local\Comfy-Desktop\ComfyUI-Shared\input"
SCRIPT = json.load(open(os.path.join(PROJ, "video", os.environ.get("VO_SCRIPT", "script_v2.json")), encoding="utf-8"))
REF_TEXT = "راوی، کلمه نمی‌شمارد. روایت‌ها را می‌فهمد، و به شما می‌گوید کدام روایت، در آستانه‌ی انفجار است."
PAUSE = {".": 0.42, ":": 0.32, "؟": 0.45, "!": 0.4}


def sentences(text):
    parts = re.findall(r"[^.:؟!]+[.:؟!]?", text)
    return [p.strip() for p in parts if p.strip()]


def tts(text, seed, prefix, ref=None, exaggeration=0.6, cfg=0.3, temperature=0.7):
    g = {"tts": {"class_type": "GooyaBozorgTTS", "inputs": {
        "text": text, "seed": seed, "exaggeration": exaggeration, "cfg_weight": cfg, "language": "Persian",
        "temperature": temperature, "repetition_penalty": 1.2, "min_p": 0.05, "top_p": 1.0}},
        "save": {"class_type": "SaveAudio", "inputs": {"audio": ["tts", 0], "filename_prefix": prefix}}}
    if ref:
        g["ref"] = {"class_type": "LoadAudio", "inputs": {"audio": ref}}
        g["tts"]["inputs"]["reference_audio"] = ["ref", 0]
    return post(g)[0]


_model = None


def cer_score(path, text):
    global _model
    if _model is None:
        from faster_whisper import WhisperModel
        _model = WhisperModel("small", device="cpu", compute_type="int8")
    segs, _ = _model.transcribe(path, language="fa", beam_size=5)
    heard = "".join(s.text for s in segs)
    norm = lambda t: "".join(ch for ch in t if ch.isalpha())
    return difflib.SequenceMatcher(None, norm(text), norm(heard)).ratio(), heard


def ending(path):
    """Sentence-final contour: pitch movement over the last 0.5 s of voicing (semitones, want < 0)
    and whether the take ends in silence (raw tail level, want < -50 dB; louder = cut mid-word)."""
    import librosa, numpy as np
    y, sr = librosa.load(path, sr=24000)
    f0, vf, _ = librosa.pyin(y, fmin=70, fmax=400, sr=sr, frame_length=1024)
    t = librosa.times_like(f0, sr=sr, hop_length=256)
    idx = np.where(vf)[0]
    if len(idx) < 8:
        return 0.0, 0.0
    last = t[idx[-1]]
    def med(a, b):
        m = (t >= a) & (t < b) & vf
        return float(np.median(12 * np.log2(f0[m] / 100))) if m.sum() > 3 else float("nan")
    slope = med(last - 0.5, last + 0.01) - med(last - 1.3, last - 0.5)
    rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=256)[0]
    tail = float(20 * np.log10(rms[-6:].mean() + 1e-9))
    return (0.0 if slope != slope else round(slope, 1)), round(tail, 1)


def dur(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True).stdout.strip())


def letters(text):
    return sum(ch.isalpha() for ch in text)


def stage_ref():
    out = os.path.join(WORK, "ref")
    best = None
    for seed in (11, 23, 37, 41, 59, 73):
        f = tts(REF_TEXT, seed, f"audio/ravi_v2/ref_{seed}", exaggeration=0.55, cfg=0.35)
        dst = os.path.join(out, f"ref_{seed}.flac")
        fetch(f, dst)
        r, heard = cer_score(dst, REF_TEXT)
        pace = letters(REF_TEXT) / dur(dst)
        print(f"ref seed {seed}: cer {r:.3f} pace {pace:.1f} l/s | {heard}", flush=True)
        score = r - 0.02 * abs(pace - 11.5)
        if best is None or score > best[0]:
            best = (score, dst, seed)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", best[1], "-ar", "24000", "-ac", "1",
                    os.path.join(COMFY_IN, "ravi_ref.wav")], check=True)
    shutil.copy(best[1], os.path.join(WORK, "ravi_ref_chosen.flac"))
    print("chosen ref seed", best[2])


V2MAP = os.path.join(PROJ, "work", "vo_v3_v2map.json")   # v3 sentence key -> [v2 key, v2 chosen file, end slope, tail dB]


def reusable():
    """Keys whose earlier human pick has the same words and already ends well (falls, not cut off)."""
    if not os.path.exists(V2MAP):
        return {}
    m = json.load(open(V2MAP, encoding="utf-8"))
    return {k: v for k, v in m.items() if v and v[2] < -1 and v[3] <= -45}


def stage_takes(n):
    seeds = [101, 202, 303, 404, 505, 606, 707, 808][:n]
    skip = reusable()
    for s in SCRIPT:
        for i, sent in enumerate(sentences(s["fa"])):
            if f"{s['id']}_{i:02d}" in skip:
                continue
            for seed in seeds:
                dst = os.path.join(WORK, "takes", f"{s['id']}_{i:02d}_{seed}.flac")
                if os.path.exists(dst):
                    continue
                f = tts(sent, seed, f"audio/ravi_v2/{s['id']}_{i:02d}_{seed}", ref="ravi_ref.wav")
                fetch(f, dst)


def stage_pick():
    picks = {}
    m = json.load(open(V2MAP, encoding="utf-8")) if os.path.exists(V2MAP) else {}
    v2dir = os.path.join(PROJ, "work", "vo_v2", "takes")
    for key, v in m.items():   # offer the earlier human pick as an extra take
        if v:
            shutil.copy(os.path.join(v2dir, v[1]), os.path.join(WORK, "takes", f"{key}_v2pick.flac"))
    for s in SCRIPT:
        for i, sent in enumerate(sentences(s["fa"])):
            rows = []
            for f in sorted(glob.glob(os.path.join(WORK, "takes", f"{s['id']}_{i:02d}_*.flac"))):
                r, heard = cer_score(f, sent)
                pace = letters(sent) / max(dur(f), 0.1)
                slope, tail = ending(f)
                score = r - 0.015 * max(0, abs(pace - 9.5) - 2.0)
                score -= 0.012 * max(0.0, slope + 1.0)       # rising / flat ending sounds unfinished
                score -= 0.15 if tail > -45 else 0.0          # cut off mid-word
                rows.append({"file": os.path.basename(f), "cer": round(r, 3), "pace": round(pace, 1), "end": slope, "tail": tail,
                             "score": round(score, 3), "heard": heard})
            rows.sort(key=lambda x: -x["score"])
            entry = {"text": sent, "takes": rows}
            v2 = next((r for r in rows if r["file"].endswith("_v2pick.flac")), None)
            if v2 and v2["end"] < -1 and v2["tail"] <= -45:
                entry["override"] = v2["file"]   # keep the human choice when it already ends well
            picks[f"{s['id']}_{i:02d}"] = entry
            print(s["id"], i, rows[0]["file"], rows[0]["cer"], rows[0]["pace"], flush=True)
    json.dump(picks, open(os.path.join(WORK, "picks.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def stage_assemble():
    picks = json.load(open(os.path.join(WORK, "picks.json"), encoding="utf-8"))
    out_dir = os.path.join(PROJ, "video", "assets", "vo_norm", OUT_NAME)
    os.makedirs(out_dir, exist_ok=True)
    tmp = os.path.join(WORK, "tmp")
    os.makedirs(tmp, exist_ok=True)
    # keep the natural decay of the last syllable: gentle threshold, 0.18 s kept, short fade-out
    trim = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.04,areverse," \
           "silenceremove=start_periods=1:start_threshold=-58dB:start_silence=0.18,afade=t=in:d=0.05,areverse"
    for s in SCRIPT:
        parts = []
        sents = sentences(s["fa"])
        for i, sent in enumerate(sents):
            key = f"{s['id']}_{i:02d}"
            chosen = picks[key].get("override") or picks[key]["takes"][0]["file"]
            seg = os.path.join(tmp, f"{key}.wav")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(WORK, "takes", chosen), "-af", trim,
                            "-ar", "48000", "-ac", "1", seg], check=True)
            parts.append(seg)
            if i < len(sents) - 1:
                gap = os.path.join(tmp, f"{key}_gap.wav")
                subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
                                "-t", str(PAUSE.get(sent[-1], 0.4)), gap], check=True)
                parts.append(gap)
        lst = os.path.join(tmp, f"{s['id']}.txt")
        open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
        raw = os.path.join(tmp, f"{s['id']}_raw.wav")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, raw], check=True)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af",
                        "highpass=f=70,deesser=i=0.3,aecho=0.8:0.5:28:0.06,loudnorm=I=-16:TP=-1.5:LRA=9",
                        "-ar", "48000", os.path.join(out_dir, f"{s['id']}.wav")], check=True)
        print("assembled", s["id"], round(dur(os.path.join(out_dir, f"{s['id']}.wav")), 2), flush=True)


if __name__ == "__main__":
    {"ref": stage_ref, "takes": lambda: stage_takes(int(sys.argv[2]) if len(sys.argv) > 2 else 4),
     "pick": stage_pick, "assemble": stage_assemble}[sys.argv[1]]()
