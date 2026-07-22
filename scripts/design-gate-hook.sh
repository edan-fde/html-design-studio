#!/bin/bash
# design-gate-hook.sh — PreToolUse(Bash) hook: verify the design-process gate before long-form rendering
#
# Non-negotiable rule established 2026-07-17: before huashu-design creates a design, it must provide
# ① an asset protocol (brand-spec.md) and ② three real visual directions for the user to choose from
# (direction-approved.md records the choice or reason for exemption).
# In the 210s B00 production, rendering the full film before direction approval forced a complete rework.
# This hook turns that lesson into a machine-enforced constraint: **renders ≥45 seconds require
# direction-approved.md**. Pausing is far cheaper than reworking a long film.
#
# Allow when any condition is met:
#   - Render duration is <45s or cannot be determined (keep short films/experiments low-friction; SKILL.md still governs the gate)
#   - direction-approved.md exists in the project directory or either of its two parents
#   - The command explicitly includes SKIP_DESIGN_GATE=1 (an auditable escape hatch for an explicit user exemption)
#
# settings.json configuration: PreToolUse / matcher "Bash" / command pointing to this script

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | python3 -c "import json,sys;print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)
CWD=$(printf '%s' "$INPUT" | python3 -c "import json,sys;print(json.load(sys.stdin).get('cwd',''))" 2>/dev/null)

# Allow commands that merely discuss other commands (echo/grep, etc.) to avoid false positives on plain text (QA Bug 1).
FIRST=$(echo "$CMD" | sed -E 's/^[[:space:]]*//' | cut -d' ' -f1)
case "$FIRST" in echo|printf|grep|cat|ls|head|tail|wc|sed|awk) exit 0;; esac
# Restrict the hook to render commands (including npm run render and narrated long-form rendering).
echo "$CMD" | grep -qE "hyperframes(@[0-9.]+)? +render|render-video(-seek)?\.js|render-narration\.sh|npm +run +render\b" || exit 0
# Explicit bypass (auditable escape hatch).
echo "$CMD" | grep -q "SKIP_DESIGN_GATE=1" && exit 0

# Locate the project directory: the command's cd target takes precedence over the hook cwd.
DIR="$CWD"
CDDIR=$(echo "$CMD" | grep -oE 'cd +"[^"]+"|cd +[^ &;]+' | head -1 | sed -E 's/^cd +//; s/"//g')
[ -n "$CDDIR" ] && [ -d "$CDDIR" ] && DIR="$CDDIR"

# Determine duration: read data-duration from index.html for HyperFrames projects; read --duration for render-video-seek.
DUR=""
D_ARG=$(echo "$CMD" | grep -oE '\-\-duration=[0-9]+' | head -1 | cut -d= -f2)
[ -n "$D_ARG" ] && DUR="$D_ARG"
if [ -z "$DUR" ] && [ -f "$DIR/index.html" ]; then
  DUR=$(grep -oE 'data-duration="[0-9.]+"' "$DIR/index.html" | head -1 | grep -oE '[0-9.]+' | cut -d. -f1)
fi
# Allow unknown durations and short films.
[ -z "$DUR" ] && exit 0
[ "$DUR" -lt 45 ] 2>/dev/null && exit 0

# Long-form render: look for the gate file in the project directory and its two parents.
for d in "$DIR" "$DIR/.." "$DIR/../.."; do
  [ -f "$d/direction-approved.md" ] && exit 0
done

cat >&2 << EOF
🛑 Design-process gate: this render is ${DUR}s (long-form, ≥45s), but direction-approved.md was not found in the project.
huashu-design requires presenting three real visual directions for the user to choose from before a long-form render (unless the user explicitly grants an exemption). Record the choice or exemption in direction-approved.md in the project directory, including the versions shown, screenshot paths, and the user's exact choice.
Add the record, then render again. If the user explicitly asks to skip the gate, prefix the command with SKIP_DESIGN_GATE=1.
(Basis: in the 2026-07-17 B00 production, skipping direction approval before rendering the 210s film forced a complete visual rework.)
EOF
exit 2
