"""Write video/index.html from the scene slot list and the chosen VO take.

  python tools/build_index.py edge            # VO from assets/vo/<id>.mp3
  python tools/build_index.py gooya/4242      # VO from assets/vo_gooya/4242/<id>.flac
Each scene slot = max(design length, VO length + tail). VO starts LEAD s into its scene.
"""
import glob, json, os, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "video")
# id, designed slot length (s), VO lead into the scene (s)
SCENES = [
    ("noise", 11.0, 0.5), ("problem", 9.0, 0.3), ("reveal", 10.0, 1.2), ("compass", 19.0, 0.5), ("brief", 14.0, 0.6),
    ("radar", 20.5, 0.6), ("council", 15.0, 0.5), ("electorate", 17.5, 0.5), ("studio", 12.5, 0.4),
    ("leverage", 4.5, 0.2), ("rival", 17.0, 0.4), ("influence", 13.5, 0.4),
    ("approve", 12.5, 0.4), ("loop", 5.5, 0.3), ("close", 13.0, 0.4),
]
TAIL = 0.6
MUSIC = "assets/music/bed.wav"
# scene, offset into scene (s), sfx file, volume
SFX = [
    ("reveal", 0.5, "whoosh", 0.7), ("reveal", 1.4, "impact", 0.8), ("brief", 1.4, "pop", 0.6),
    ("radar", 3.8, "pop", 0.5), ("radar", 10.3, "whoosh", 0.5), ("council", 1.2, "blip", 0.5),
    ("council", 3.4, "blip", 0.5), ("council", 5.6, "blip", 0.5), ("council", 7.6, "blip", 0.5),
    ("electorate", 10.4, "pop", 0.6), ("electorate", 13.7, "pop", 0.6), ("studio", 1.3, "whoosh", 0.4),
    ("approve", 5.5, "snap", 0.9), ("leverage", 0.7, "impact", 0.6), ("rival", 9.9, "pop", 0.6), ("rival", 8.2, "whoosh", 0.4), ("compass", 13.6, "whoosh", 0.4), ("compass", 9.0, "pop", 0.4), ("influence", 5.6, "whoosh", 0.4), ("close", 5.2, "thump", 0.7),
]


def dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True).stdout.strip()
    return float(out)


def vo_path(take, sid):
    # loudness-normalised copies: assets/vo_norm/edge/<id>.wav or assets/vo_norm/gooya_<seed>/<id>.wav
    return f"assets/vo_norm/{take.replace('/', '_')}/{sid}.wav"


def main(take):
    t = 0.0
    hosts, audios, timing = [], [], []
    for i, (sid, slot, lead) in enumerate(SCENES):
        vp = vo_path(take, sid)
        vd = dur(os.path.join(ROOT, vp))
        slot = round(max(slot, lead + vd + TAIL), 2)
        hosts.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" '
                     f'data-start="{t:.2f}" data-duration="{slot}" data-track-index="1" data-track-kind="graphics" '
                     f'data-width="1920" data-height="1080"></div>')
        audios.append(f'      <audio id="vo-{sid}" class="clip" data-start="{t + lead:.2f}" data-duration="{vd:.2f}" '
                      f'data-track-index="{2 + i % 2}" data-volume="1" src="{vp}"></audio>')
        timing.append({"id": sid, "start": round(t, 2), "slot": slot, "vo": round(vd, 2)})
        t += slot
    total = round(t, 2)
    starts = {x["id"]: x["start"] for x in timing}
    for k, (sid, off, f, vol) in enumerate(SFX):
        d = dur(os.path.join(ROOT, "assets", "sfx", f + ".wav"))
        audios.append(f'      <audio id="sfx-{k}" class="clip" data-start="{starts[sid] + off:.2f}" data-duration="{d:.2f}" '
                      f'data-track-index="5" data-volume="{vol}" src="assets/sfx/{f}.wav"></audio>')
    music = ""
    if os.path.exists(os.path.join(ROOT, MUSIC)):
        music = (f'      <audio id="music" class="clip" data-start="0" data-duration="{total}" data-track-index="4" '
                 f'data-volume="0.18" data-fade-out="3" src="{MUSIC}"></audio>')
    html = f"""<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #111312; }}
      #root {{ position: relative; width: 100%; height: 100%; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="1920" data-height="1080">
{chr(10).join(hosts)}
{chr(10).join(audios)}
{music}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""
    open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(html)
    json.dump(timing, open(os.path.join(ROOT, "timing.json"), "w"), indent=1)
    print("total", total)
    for x in timing:
        print(x)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "edge")
