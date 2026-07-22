# AI Video Review Feedback Loop (`ai-review-video.py`)

> Feed the final MP4 render to a video-understanding model (`seed-2.0-lite`) and produce a structured review report from a fixed checklist.
> Purpose: the final quality gate **after the final render and before delivery**, replacing a manual rewatch of the entire video. It does not replace frame-by-frame checks with `verify-video.sh`.

## When to Use It

- Run it after the final 60 fps video has been rendered and before delivery or mixing.
- Run it again after the SFX mix is ready (onset verification works only when an audio track is present).
- Run it again after fixing major issues and rerendering.
- Do not run it during the 30 fps test-render stage (resolution and pacing are not yet final, so the call would be wasted).

## How to Use It

```bash
cd project-directory && unset ALL_PROXY   # The script already bypasses proxies; unset is an extra safeguard
uv run ~/.claude/skills/html-design-studio/scripts/ai-review-video.py \
  --video final-video.mp4 \
  --context director-script.md        # Strongly recommended: this lets the model distinguish “design intent” from a “bug”
```

- The report is written beside the video as `<video-name>-AI-review.md` (override with `--output`).
- `--segment-len` defaults to 60 seconds per segment; `--model` defaults to `doubao-seed-2-0-lite-260215`.
- Measured on a 210-second video: 6 API calls, 6–10 minutes, approximately 180,000 input tokens and 20,000 output tokens (lite tier; cost measured in cents).

## Processing Pipeline (Three-Layer Hybrid, Not a Pure Model Pass)

1. **Objective `ffmpeg` detection** (deterministic and comprehensive):
   - `silencedetect` → SFX-onset timeline (the model **cannot hear** the video's audio track, as verified on 2026-07-17).
   - `freezedetect` → list of completely static intervals lasting at least 3 seconds.
2. **Segment-by-segment model review**: compress and submit the video in 60-second segments (1280 px wide / 15 fps / CRF 28; flat animation is approximately 0.5 MB per minute).
   Each segment prompt includes the checklist, director's script, and onset/freeze data for that segment; timestamps are converted back to the original video's timeline.
3. **Low-resolution full-video model pass**: submit the entire video separately at 960 px wide / 10 fps, specifically to inspect cross-segment narrative continuity, hero-element continuity, and overall pacing.
4. A text-aggregation call consolidates the findings under items ①–⑧; all raw segment notes and objective detection data remain in the report appendix.

## Checklist and Severity

① Black frames / incomplete renders ② Cropped text / typos ③ Overlapping or obscured elements ④ Narrative continuity (three transition classes: hard cut / fade in or out / morph)
⑤ Hero-element continuity ⑥ Dead spots in the pacing (objective list + model judgment: intentional hold or truly dead interval) ⑦ Sound-effect sync points (cross-check audio onset against visual event)
⑧ Unbalanced composition / empty areas

⚠️ Critical = must fix before delivery | ⚡ Important = clearly harms the viewing experience | 💡 Suggestion = optional polish

## Limitations (Read Before Using the Report)

- **The model cannot hear audio**: item ⑦ checks only whether a visual event occurs at each audio-track onset.
  It cannot judge whether the chosen sound effect is appropriate, whether its volume is right, or whether the BGM's mood fits.
- **It cannot see frame-level detail**: it will miss one- or two-frame flashes, subtle jitter, exact color-value deviations, and subpixel alignment errors.
  Continue to inspect extracted frames manually with `verify-video.sh` for those issues.
- **Transition classification is overly strict**: after compression to 15 fps, a fast crossfade may be reported as a “hard cut.”
  When the segment and full-video passes conflict, the summary marks the finding as “uncertain.” Extract the relevant frames and confirm it yourself before changing anything.
- **“Intentional hold vs. dead spot” is the model's opinion**: a long still used as B-roll under narration will often be accepted, but you must judge it again when the final video is intended to stand on its own.
- A failed call (network, key, or quota) is recorded honestly at the top of the report; the script never fabricates review results. The affected time range is explicitly marked.

## Measured Baseline

First test video: `B00-前三分钟主线-SFX.mp4` (original filename; “B00—first three minutes, main thread—SFX”; 210 seconds). The model correctly identified the direction of inter-scene transition problems and hero-element discontinuities,
but misclassified fades as hard cuts. Pure model review found only 3 of 14 dead intervals; adding `freezedetect` achieved complete coverage. Conclusion: the objective detection layer
provides the minimum quality guarantee for this loop, while the model supplies semantic judgment.
