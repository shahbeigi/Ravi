#!/usr/bin/env bash
# Generate one image with the Codex built-in image tool (user's ChatGPT subscription).
# usage: codex_img.sh OUT.png PROMPT.txt [REF1.png REF2.png ...]
set -u
OUT="$1"; PROMPT_FILE="$2"; shift 2
C=/c/Users/hsar72/AppData/Local/OpenAI/Codex/bin/22cfb1d302613eae/codex.exe
GEN=~/.codex/generated_images
OUTDIR=$(dirname "$OUT"); mkdir -p "$OUTDIR"
MARK=$(mktemp); touch "$MARK"
ARGS=()
for r in "$@"; do ARGS+=(-i "$(cygpath -w "$r")"); done
{
  echo "Use your built-in image generation tool directly (do NOT write code, do NOT use any API script)."
  echo "Generate exactly ONE image, ${ASPECT:-16:9 landscape (1536x1024 or similar)}, photorealistic unless the brief says otherwise."
  echo "Attached images are references: match their characters, design, materials, location and lighting exactly where the brief says so."
  echo "After generating, copy THE IMAGE YOU JUST GENERATED IN THIS SESSION (not the newest file in the folder; other sessions run in parallel) to: $(cygpath -w "$OUT")  -- then reply only with DONE."
  echo
  echo "BRIEF:"
  cat "$PROMPT_FILE"
} | timeout 1500 "$C" exec --skip-git-repo-check -s workspace-write -C "$(cygpath -w "$OUTDIR")" "${ARGS[@]}" - > "$OUT.log" 2>&1
# Trust only images from THIS run's own Codex session folder (parallel runs share generated_images/).
SID=$(grep -m1 -io "session id: [0-9a-f-]*" "$OUT.log" | awk '{print $3}')
OWN=$(find "$GEN/$SID" -name '*.png' -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
if [ -n "$SID" ] && [ -n "$OWN" ]; then
  cp "$OWN" "$OUT"
elif [ ! -s "$OUT" ]; then
  echo "no image in session $SID" >> "$OUT.log"
fi
rm -f "$MARK"
[ -s "$OUT" ] && echo "OK $OUT" || { echo "FAIL $OUT"; tail -5 "$OUT.log"; }
