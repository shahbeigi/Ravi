"""Regenerate a few sentences with written variants (pronunciation hints / rewording) and add them to the picker.

  VO_SCRIPT=script_v3.json VO_WORK=vo_v3 VO_OUT=v3 python tools/vo_redo.py
New takes are named <key>_r<variant><seed>.flac, scored against their own text, labelled for the picker,
and listed first; the key's override is cleared so the human picks again.
"""
import json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vo_pipeline as vp
from gen_audio import fetch

REDO = {
    "problem_01": [("D", "آن وقت، دیگر روایت مال شما نیست.", "دیگر before روایت", 6)],
    "radar_01": [("A", "می‌بیند، هر روایت، کجا متولد شده است، و چه کسانی آن را پیش می‌برند.", "your pauses", 6)],
    "council_01": [("A", "یکی منابع را می‌خوانَد.", "می‌خوانَد (fatha)", 4)],
    "studio_00": [("D", "یک ایده به ویدیوی کوتاه، پست تلگرام و رشته‌توییت تبدیل می‌شود.", "ویدیوی کوتاه", 6)],
}
SEEDS = [111, 222, 333, 444, 555, 666]

picks_path = os.path.join(vp.WORK, "picks.json")
picks = json.load(open(picks_path, encoding="utf-8"))
for key, variants in REDO.items():
    rows = []
    for tag, text, label, n in variants:
        for seed in SEEDS[:n]:
            name = f"{key}_r{tag}{seed}.flac"
            dst = os.path.join(vp.WORK, "takes", name)
            if not os.path.exists(dst):
                fetch(vp.tts(text, seed, f"audio/ravi_v3r/{key}_r{tag}{seed}", ref="ravi_ref.wav"), dst)
            r, heard = vp.cer_score(dst, text)
            slope, tail = vp.ending(dst)
            pace = vp.letters(text) / max(vp.dur(dst), 0.1)
            score = r - 0.012 * max(0.0, slope + 1.0) - (0.15 if tail > -45 else 0.0)
            rows.append({"file": name, "label": f"{label} · {seed}", "text": text, "cer": round(r, 3), "pace": round(pace, 1),
                         "end": slope, "tail": tail, "score": round(score, 3), "heard": heard})
            print(key, name, round(r, 3), slope, tail, flush=True)
    rows.sort(key=lambda x: -x["score"])
    old = [t for t in picks[key]["takes"] if not t["file"].startswith(f"{key}_r")]
    picks[key]["takes"] = rows + old
    picks[key]["text"] = variants[0][1] + "  (new variants first; older takes below)"
    picks[key].pop("override", None)
json.dump(picks, open(picks_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("REDO_DONE")
