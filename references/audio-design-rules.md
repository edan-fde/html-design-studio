# Audio Design Rules · huashu-design

> Audio recipes for every animated demo. Use together with `sfx-library.md`, the asset catalog.
> Refined through practice: huashu-design launch-hero iterations v1–v9; Gemini deep analysis of three official Anthropic videos; more than 8,000 A/B comparisons.

---

## Core Principle · Two Independent Audio Layers (Non-Negotiable)

Animation audio **must be designed as two independent layers**. One layer alone is not enough:

| Layer | Purpose | Time Scale | Relationship to Visuals | Frequency Range |
|---|---|---|---|---|
| **SFX (beat layer)** | Marks each visual beat | Short, 0.2–2 seconds | **Tightly synchronized** (frame-accurate) | **High frequencies, 800 Hz+** |
| **BGM (atmosphere bed)** | Establishes emotion and soundstage | Continuous, 20–60 seconds | Loosely synchronized (section-level) | **Low and mid frequencies, <4 kHz** |

**Animation with BGM alone is incomplete.** Viewers subconsciously notice that “the picture moves, but the sound does not respond.” That disconnect is the source of the cheap feeling.

---

## Gold Standard · Target Ratios

These values are **hard engineering parameters** derived from measured comparisons of three official Anthropic videos and our own final v9 release. Apply them directly.

### Volume
- **BGM volume:** `0.40–0.50` relative to full-scale 1.0
- **SFX volume:** `1.00`
- **Loudness difference:** BGM peak should be **6–8 dB below** the SFX peak. Make SFX stand out through the difference in loudness, not excessive absolute SFX volume.
- **`amix` parameter:** `normalize=0`. Never use `normalize=1`; it flattens the dynamic range.

### Frequency Separation (P1 Hard Optimization)
Anthropic's secret is not “louder SFX”; it is **frequency layering**:

```bash
[bgm_raw]lowpass=f=4000[bgm]      # Restrict BGM to low and mid frequencies below 4 kHz
[sfx_raw]highpass=f=800[sfx]      # Push SFX into mid and high frequencies above 800 Hz
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]
```

Why it works: the human ear is most sensitive between 2 and 5 kHz—the presence range. If SFX occupy that range while full-bandwidth BGM also covers it, **the BGM's high-frequency content masks the SFX**. High-pass the SFX and low-pass the BGM so each occupies its own part of the spectrum; SFX clarity improves immediately.

### Fades
- BGM in: `afade=in:st=0:d=0.3` (0.3 seconds; prevents a hard cut)
- BGM out: `afade=out:st=N-1.5:d=1.5` (1.5-second tail; creates closure)
- SFX already have their own envelopes and need no additional fade

---

## SFX Cue Design Rules

### Density: How Many SFX per 10 Seconds?
Measurements of three Anthropic videos reveal three density bands:

| Video | SFX per 10 Seconds | Product Character | Scenario |
|---|---|---|---|
| Artifacts (`ref-1`) | **~9 / 10 s** | Feature-dense, information-rich | Complex tool demonstration |
| Code Desktop (`ref-2`) | **0** | Pure atmosphere, meditative | Focused state in a developer tool |
| Word (`ref-3`) | **~4 / 10 s** | Balanced office rhythm | Productivity tool |

**Heuristics:**
- Calm or focused product character → low SFX density (0–3 / 10 s), with BGM leading.
- Lively or information-rich product character → high SFX density (6–9 / 10 s), with SFX driving the rhythm.
- **Do not fill every visual beat.** Restraint feels more sophisticated than constant activity. **Removing 30–50% of cues makes the remaining cues more dramatic.**

### Cue Selection Priority
Not every visual beat needs an SFX. Select them in this order:

**P0 · Mandatory** (omission feels wrong):
- Typing in a terminal or input field
- Clicking or selecting, especially at a decision point
- A shift in focus from one visual protagonist to another
- Logo reveal and brand resolution

**P1 · Recommended:**
- Element entrance or exit, such as a modal or card
- Completion or success feedback
- Start or end of AI generation
- Major transitions between scenes

**P2 · Optional** (too many become chaotic):
- Hover / focus-in
- Progress tick
- Decorative ambience

### Timestamp Alignment Precision
- **Same-frame alignment** (0 ms error): click, focus shift, logo lockup.
- **Lead by 1–2 frames** (−33 ms): fast whoosh, creating psychological anticipation.
- **Lag by 1–2 frames** (+33 ms): object landing or impact, matching real physics.

---

## BGM Selection Decision Tree

The huashu-design skill includes six BGM tracks (`assets/bgm-*.mp3`):

```
What is the animation's character?
├─ Product launch / technical demo → bgm-tech.mp3 (minimal synth + piano)
├─ Tutorial / tool use → bgm-tutorial.mp3 (warm, instructional)
├─ Education / explaining principles → bgm-educational.mp3 (curious, thoughtful)
├─ Advertising / brand promotion → bgm-ad.mp3 (upbeat, promotional)
└─ Need a variation in the same style → bgm-*-alt.mp3 (alternate version of each)
```

### Scenarios Without BGM (Worth Considering)
Anthropic Code Desktop (`ref-2`) demonstrates that **zero SFX + pure lo-fi BGM** can feel highly refined. The inverse arrangement—carefully chosen SFX with no BGM—can also work when the conditions below apply.

**When to omit BGM entirely:**
- Animation is shorter than 10 seconds, leaving too little time to establish a musical bed.
- Product character is focused or meditative.
- The scene already contains environmental sound or narration.
- SFX density is high and BGM would create auditory overload.

---

## Ready-to-Use Recipes

### Recipe A · Product-Launch Hero (Same Pattern as huashu-design v9)
```
Duration: 25 seconds
BGM: bgm-tech.mp3 · 45% · frequencies below 4 kHz
SFX density: ~6 / 10 s

Cues:
  Terminal typing → type × 4 (0.6 s intervals)
  Enter key       → enter
  Cards converge  → card × 4 (staggered by 0.2 s)
  Selection       → click
  Ripple          → whoosh
  Four focus shifts → focus × 4
  Logo            → thud (1.5 s)

Volume: BGM 0.45 / SFX 1.0 · amix normalize=0
```

### Recipe B · Tool Feature Demonstration (Based on Anthropic Code Desktop)
```
Duration: 30–45 seconds
BGM: bgm-tutorial.mp3 · 50%
SFX density: 0–2 / 10 s (extremely sparse)

Strategy: let BGM + explanatory voice-over drive the experience. Use SFX only at decisive moments,
such as saving a file or completing command execution.
```

### Recipe C · AI Generation Demonstration
```
Duration: 15–20 seconds
BGM: bgm-tech.mp3 or none
SFX density: ~8 / 10 s (high density)

Cues:
  User input → type + enter
  AI begins processing → magic/ai-process (1.2 s loop)
  Generation completes → feedback/complete-done
  Result appears → magic/sparkle

Signature detail: loop ai-process two or three times throughout the generation process.
```

### Recipe D · Pure-Atmosphere Long Take (Based on Artifacts)
```
Duration: 10–15 seconds
BGM: none
SFX: use three to five carefully designed cues by themselves

Strategy: every SFX becomes a protagonist, without BGM smearing them together.
Best for: a slow product shot or close-up showcase.
```

---

## `ffmpeg` Mixing Templates

### Template 1 · Overlay One SFX on a Video
```bash
ffmpeg -y -i video.mp4 -itsoffset 2.5 -i sfx.mp3 \
  -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0[a]" \
  -map 0:v -map "[a]" output.mp4
```

### Template 2 · Build a Multi-SFX Timeline Aligned to Cue Times
```bash
ffmpeg -y \
  -i sfx-type.mp3 -i sfx-enter.mp3 -i sfx-click.mp3 -i sfx-thud.mp3 \
  -filter_complex "\
[0:a]adelay=1100|1100[a0];\
[1:a]adelay=3200|3200[a1];\
[2:a]adelay=7000|7000[a2];\
[3:a]adelay=21800|21800[a3];\
[a0][a1][a2][a3]amix=inputs=4:duration=longest:normalize=0[mixed]" \
  -map "[mixed]" -t 25 sfx-track.mp3
```
**Key parameters:**
- `adelay=N|N`: the first value delays the left channel in milliseconds, the second delays the right. Repeat the value to preserve stereo alignment.
- `normalize=0`: preserves dynamic range. This is critical.
- `-t 25`: truncates to the specified duration.

### Template 3 · Video + SFX Track + BGM with Frequency Separation
```bash
ffmpeg -y -i video.mp4 -i sfx-track.mp3 -i bgm.mp3 \
  -filter_complex "\
[2:a]atrim=0:25,afade=in:st=0:d=0.3,afade=out:st=23.5:d=1.5,\
     lowpass=f=4000,volume=0.45[bgm];\
[1:a]highpass=f=800,volume=1.0[sfx];\
[bgm][sfx]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k final.mp4
```

---

## Failure-Mode Cheatsheet

| Symptom | Root Cause | Fix |
|---|---|---|
| SFX are inaudible | High-frequency BGM content masks them | Add `lowpass=f=4000` to BGM + `highpass=f=800` to SFX |
| Sound effects are painfully loud | Absolute SFX volume is too high | Lower SFX to 0.7 and BGM to 0.3, preserving the difference |
| BGM rhythm conflicts with SFX | The BGM has an overly strong beat | Replace it with ambient or minimal-synth BGM |
| BGM stops abruptly at the end | No fade-out | Add `afade=out:st=N-1.5:d=1.5` |
| Overlapping SFX turn into mud | Cues are too dense and each SFX is too long | Keep SFX under 0.5 seconds and cue intervals ≥0.2 seconds |
| A WeChat article MP4 has no sound | WeChat sometimes mutes autoplay | This is expected; sound plays when the user opens it. GIFs never contain sound. |

---

## Connecting Audio and Visuals (Advanced)

### Match SFX Timbre to the Visual Style
- Warm beige or paper-like visuals → **wooden / soft** timbres: Morse, paper snap, soft click.
- Cool black technological visuals → **metallic / digital** timbres: beep, pulse, glitch.
- Hand-drawn or playful visuals → **cartoon / exaggerated** timbres: boing, pop, zap.

The warm beige background in the current `apple-gallery-showcase.md` pairs with `keyboard/type.mp3` (mechanical) + `container/card-snap.mp3` (soft) + `impact/logo-reveal-v2.mp3` (cinematic bass).

### SFX Can Lead the Visual Rhythm
Advanced technique: **design the SFX timeline first, then adjust visual motion to align with it**, not the reverse.
Each SFX cue acts like a clock tick. Fitting motion to the SFX rhythm creates extremely stable timing; making SFX chase the picture often lands ±1 frame out and feels subtly wrong.

---

## Quality Checklist Before Release

- [ ] Loudness difference: is SFX peak − BGM peak equal to 6–8 dB?
- [ ] Frequency split: BGM low-pass at 4 kHz + SFX high-pass at 800 Hz?
- [ ] `amix normalize=0` to preserve dynamic range?
- [ ] BGM fade-in 0.3 s + fade-out 1.5 s?
- [ ] Is the number of SFX appropriate for the scenario's character?
- [ ] Is every SFX aligned to its visual beat within ±1 frame?
- [ ] Is the logo-reveal sound long enough—1.5 seconds recommended?
- [ ] Listen with BGM muted: do the SFX have enough rhythm by themselves?
- [ ] Listen with SFX muted: does the BGM have an emotional arc by itself?

Each layer should make sense when heard alone. If the mix works only when both are combined, neither layer has been designed well enough.

---

## References

- SFX asset catalog: `sfx-library.md`
- Visual-style reference: `apple-gallery-showcase.md`
- Deep audio analysis of three Anthropic videos: `AUDIO-BEST-PRACTICES.md` (author's local research; not distributed with the repository)
- huashu-design v9 case study: `hero-animation-v9-final.mp4` (author's local sample; not distributed with the repository)
