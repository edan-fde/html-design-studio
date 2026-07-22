#!/bin/bash
# sfx-cues.sh — Add SFX to a silent video from a cue sheet (distilled from the B00 step-change b-roll production, 2026-07-17)
#
# Usage: bash sfx-cues.sh <silent-video.mp4> <cue-sheet.tsv> <output.mp4> [--dur=seconds]
#
# Cue-sheet format (TSV; lines beginning with # are comments):
#   seconds<TAB>relative SFX path (under assets/sfx/)<TAB>volume dB
#   Example: 63.0	impact/brand-stamp.mp3	-13
#
# Level baseline (light SFX beneath narration): whoosh -16 / tick -15 / impact -12; raise everything by 4 dB for animation-only deliverables.
# Follow the cue-density recipe in audio-design-rules.md (background b-roll ≈ one cue per 9s; mark structural beats only).

set -e
SFX_DIR="$(cd "$(dirname "$0")/../assets/sfx" && pwd)"
IN="${1:?Usage: bash sfx-cues.sh in.mp4 cues.tsv out.mp4 [--dur=210]}"
TABLE="${2:?Missing cue sheet}"
OUT="${3:?Missing output path}"
DUR=""
for a in "$@"; do case "$a" in --dur=*) DUR="${a#*=}";; esac; done
[ -z "$DUR" ] && DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN" | cut -d. -f1)

INPUTS=(-i "$IN")
FILTER=""; MIX=""; i=1
while IFS=$'\t' read -r t f db; do
  [ -z "$t" ] && continue
  case "$t" in \#*) continue;; esac
  [ ! -f "$SFX_DIR/$f" ] && { echo "✗ SFX not found: $f"; exit 1; }
  INPUTS+=(-i "$SFX_DIR/$f")
  ms=$(python3 -c "print(int(float('$t')*1000))")
  FILTER+="[$i:a]adelay=${ms}:all=1,volume=${db}dB[s$i];"
  MIX+="[s$i]"
  i=$((i+1))
done < "$TABLE"
N=$((i-1))
[ "$N" = "0" ] && { echo "✗ Cue sheet is empty"; exit 1; }

ffmpeg -y -loglevel error "${INPUTS[@]}" \
  -filter_complex "${FILTER}${MIX}amix=inputs=${N}:normalize=0,apad=whole_dur=${DUR}[aout]" \
  -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest "$OUT"

echo "✓ ${N} cues → $OUT"
