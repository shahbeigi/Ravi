"""SeedVR2 7B upscale in frame chunks so long/large clips fit in 24 GB VRAM.

  python tools/upscale_chunks.py shots/comms_team.mp4 shots/up/comms_team_up.mp4 [width=1920] [chunk_frames=40]
"""
import os, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from comfy import run, seedvr_graph

src, dst = sys.argv[1], sys.argv[2]
width = int(sys.argv[3]) if len(sys.argv) > 3 else 1920
chunk = int(sys.argv[4]) if len(sys.argv) > 4 else 40
work = os.path.splitext(dst)[0] + "_chunks"
os.makedirs(work, exist_ok=True)
fps = 24
n = int(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames",
                        "-of", "csv=p=0", src], capture_output=True, text=True).stdout.strip())
parts = []
for k, f0 in enumerate(range(0, n, chunk)):
    piece = os.path.join(work, f"in_{k:02d}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-vf", f"select='between(n,{f0},{min(n, f0 + chunk) - 1})',setpts=N/{fps}/TB",
                    "-an", "-r", str(fps), "-c:v", "libx264", "-crf", "12", piece], check=True)
    name = f"{os.path.basename(os.path.splitext(dst)[0])}_{k:02d}"
    out = run(seedvr_graph({"name": name, "upscale": piece, "width": width, "unet": "seedvr2_7b_sharp_int8_convrot.safetensors", "seed": 1}), work, name)
    if not out:
        sys.exit(f"chunk {k} failed")
    parts.append(out[0])
lst = os.path.join(work, "list.txt")
open(lst, "w").write("".join(f"file '{os.path.abspath(p)}'\n" for p in parts))
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-an", "-c:v", "libx264", "-crf", "14",
                "-pix_fmt", "yuv420p", dst], check=True)
print("UPSCALED", dst)
