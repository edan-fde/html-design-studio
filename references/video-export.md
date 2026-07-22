# Video Export · HTML Animation to MP4/GIF

Once an HTML animation is complete, users often ask whether it can be exported as video. This guide covers the complete workflow.

## When to export

**Export only when**:
- The animation has been played through and visually verified; Playwright screenshots confirm the correct state at each checkpoint
- The user has reviewed it in a browser at least once and approved the result
- **Do not export while animation bugs remain.** Changes become more expensive after video rendering

**Trigger words that users may say**:
- "Can it be exported to video?"
- "Convert to MP4"
- "Made into GIF"
- “60fps”

## Output specifications

The required deliverable is a final MP4 with both BGM and SFX unless the user explicitly requests silence. Derive a 60fps compatibility copy or GIF only when the target platform needs it:

| Format | Specifications | Suitable scenes | Typical size (30s) |
|---|---|---|---|
| MP4 25fps | 1920×1080 · H.264 · CRF 18 | Official account embedding, video account, YouTube | 1-2 MB |
| MP4 60fps | 1920×1080 · native HyperFrames/seek render, or frame duplication for compatibility · H.264 · CRF 18 | High-frame-rate playback, Bilibili, portfolios | 1.5–3 MB |
| GIF | 960×540 · 15fps · palette optimization | Twitter/X, README, Slack preview | 2-4 MB |

## Toolchain

### Default for new animation projects: HyperFrames

Use HyperFrames for new video-oriented animation projects. Run its five-gate audit, render a quick 30fps review, then render the approved final at 60fps and hard-validate the artifact:

```bash
npm run check
npx hyperframes render                 # 30fps review render
npx hyperframes render --fps 60        # approved final render
bash scripts/verify-video.sh <final.mp4> --duration=<seconds> --fps=60 --width=1920 --height=1080
```

For dark cinematic work, use `npx hyperframes check --no-contrast` while keeping the other four gates at zero errors. See `hyperframes-backend.md` for backend boundaries and audio-track options.

### Custom/legacy pipeline

Use the scripts below for constrained runtimes, single-file delivery, interactive demos, existing Stage animations, or narration-driven work covered by `voiceover-pipeline.md`.

### 1. `render-video.js` — HTML → MP4

Records a base MP4 at 25fps. Requires Playwright to be installed globally.

```bash
NODE_PATH=$(npm root -g) node /path/to/html-design-studio/scripts/render-video.js <html-file>
```

Optional parameters:
- `--duration=30` animation duration (seconds)
- `--width=1920 --height=1080` resolution
- `--trim=2.2` seconds to remove from the beginning (page reload and font-loading time)
- `--fontwait=1.5` seconds to wait for fonts; increase it when fonts load slowly

Output: Same directory as HTML, same name `.mp4`.

### 2. `add-music.sh` — MP4 + BGM → MP4

Mixes background music into a silent MP4. Choose from the built-in library by mood or supply your own audio. The script matches the duration automatically and adds fades.

```bash
bash add-music.sh <input.mp4> [--mood=<name>] [--music=<path>] [--out=<path>]
```

**Built-in BGM library** (in `assets/bgm-<mood>.mp3`):

| `--mood=` | Style | Suitable for |
|-----------|------|---------|
| `tech` (default) | Apple Silicon / Apple conference, minimalist synthesizer + piano | Product release, AI tools, Skill promotion |
| `ad` | Upbeat modern electronic music with a build and drop | Social ads, product previews, promotional videos |
| `educational` | Warm and bright; light guitar or electric piano; inviting | Science explainers, tutorial introductions, course previews |
| `educational-alt` | Similar alternative | Same uses as above; try it when the first track does not fit |
| `tutorial` | Lo-fi ambience that stays out of the way | Software demos, programming tutorials, long walkthroughs |
| `tutorial-alt` | Similar alternatives | Same as above |

**Behavior**:
- Music is trimmed to the video duration
- 0.3s fade in + 1s fade out (avoid hard cuts)
- Video uses `-c:v copy` with no re-encoding; audio is AAC at 192 kbps
- `--music=<path>` overrides `--mood` and accepts any external audio file
- If you pass the wrong mood name, all available options will be listed and will not fail silently.

**Typical custom pipeline** (platform derivatives plus the required BGM/SFX mix):
```bash
node render-video.js animation.html                        # Screen recording
bash convert-formats.sh animation.mp4                      # Derive 60fps MP4 + GIF.
bash sfx-cues.sh animation-60fps.mp4 sfx-cues.tsv with-sfx.mp4
# Combine the SFX track and BGM with Template 3 in audio-design-rules.md → final.mp4.
# or for different scenarios:
bash add-music.sh tutorial-demo.mp4 --mood=tutorial
bash add-music.sh product-promo.mp4 --mood=ad --out=promo-final.mp4
```

`sfx-cues.sh` and `add-music.sh` each replace the input audio track; they are not sequential mixers. To retain both SFX and BGM, either place both tracks directly on a HyperFrames timeline or use the frequency-separated ffmpeg mix in `audio-design-rules.md` Template 3.

### 3. `convert-formats.sh` — MP4 → 60fps MP4 + GIF

Generates a 60fps MP4 and GIF from an existing MP4.

```bash
bash /path/to/html-design-studio/scripts/convert-formats.sh <input.mp4> [gif_width] [--minterpolate]
```

Output (same directory as input):
- `<name>-60fps.mp4` — Use `fps=60` frame copy by default (wide compatibility); add `--minterpolate` to enable high-quality frame insertion
- `<name>.gif` — palette-optimized GIF (960px wide by default; configurable)

**60fps mode selection**:

| Mode | Command | Compatibility | Usage scenarios |
|---|---|---|---|
| Frame duplication (default) | `convert-formats.sh in.mp4` | Works in QuickTime, Safari, Chrome, and VLC | General delivery, upload platforms, and social media |
| `minterpolate` frame interpolation | `convert-formats.sh in.mp4 --minterpolate` | macOS QuickTime and Safari may reject it | Bilibili and other showcases that need true interpolation; test the target player locally before delivery |

Why frame duplication is now the default: the H.264 elementary stream produced by `minterpolate` has a known compatibility defect. When interpolation was the default, “cannot open in macOS QuickTime” occurred repeatedly. See `animation-pitfalls.md` §14.

`gif_width` Parameters:
- 960 (default) - Common to social platforms
- 1280 - Clearer but larger files
- 600 - Faster loading on Twitter/X

### 4. `render-video-seek.js` — True 60fps / deterministic rendering (high-quality delivery recommended)

The `recordVideo` path in `render-video.js` has three inherent limitations: Chromium's compositor locks recording to 25fps; the initial loading frame is black and must be trimmed; and 60fps requires post-process interpolation, which can ghost and trigger the macOS QuickTime compatibility defect described in `animation-pitfalls.md` §14. For true 60fps, deterministic output, or Bilibili/portfolio delivery, use seek rendering instead.

It seeks to each timestamp, captures a frame, and uses ffmpeg to encode the PNG sequence as MP4. The core technique follows HeyGen HyperFrames' “freeze the clock, seek, then capture” model (Apache 2.0), but adds no third-party packages: it uses only this skill's existing Playwright and ffmpeg dependencies and remains runtime-neutral.

```bash
NODE_PATH=$(npm root -g) node /path/to/html-design-studio/scripts/render-video-seek.js <html-file> --fps=60
```

Parameters: `--duration` · `--fps` (default 60) · `--width` · `--height` · `--concurrency` (default: four parallel workers) · `--settle` (number of rAF cycles to wait after seeking before capture; default 2, increase for layout animation) · `--keep-chrome`. Output is written beside the HTML with the same base name and an `.mp4` extension.

This directly solves all three `recordVideo` limitations:
- **True arbitrary frame rates**: `--fps=60` produces genuine 60fps output, with every frame captured from an explicit seek. It avoids `minterpolate`, ghosting, and the macOS compatibility defect
- **No initial black frame**: because this is not a screen recording, loading frames are never captured and `--trim` / `--fontwait` are unnecessary
- **Deterministic**: identical input produces identical frames, unaffected by machine load or dropped recording frames

**Support boundary (important)**: seek rendering works only with Stage-clock animations: `<Stage>` from `assets/animations.jsx` or `<NarrationStage>` from `narration_stage.jsx`. These freeze their self-driven clocks when `window.__seekRender` is active and expose `window.__seek(t)`. Pure CSS `@keyframes`, Lottie, and custom non-Stage animations do not implement `__seek`; keep using `render-video.js` for them. The script reports an error when it cannot detect `__seek`.

**Cost**: frame-by-frame capture can take longer than real-time `recordVideo` for long videos, although `--concurrency` mitigates this with multiple workers. Temporary PNGs also consume substantial disk space, so close other memory-intensive applications before rendering.

**Choose one strategy**: use HyperFrames by default for new animation projects. Within the custom pipeline, `render-video.js` is the broad-compatibility fallback because it supports every animation type; use `render-video-seek.js` when an existing Stage-clock animation requires true 60fps, determinism, or a high-quality master. For long narrated animations, `render-narration.sh --seek` performs seek rendering and mixing in one command.

## Standard end-to-end workflow

After the user says "Export video," choose the branch that matches the implementation:

```bash
cd <project-directory>

# New HyperFrames project (default):
npm run check
npx hyperframes render --fps 60
bash scripts/verify-video.sh <final.mp4> --duration=<seconds> --fps=60 --width=1920 --height=1080

# Custom/legacy project; assume $SKILL points to this skill's root directory:
NODE_PATH=$(npm root -g) node "$SKILL/scripts/render-video.js" my-animation.html
bash "$SKILL/scripts/convert-formats.sh" my-animation.mp4  # only if platform derivatives are needed
bash "$SKILL/scripts/sfx-cues.sh" my-animation.mp4 sfx-cues.tsv with-sfx.mp4
# Combine with-sfx.mp4 and the chosen BGM using audio-design-rules.md Template 3 → final.mp4.
bash "$SKILL/scripts/verify-video.sh" final.mp4 --duration=<seconds> --fps=25 --width=1920 --height=1080
```

## Technical details for troubleshooting

### Playwright `recordVideo` pitfalls

- The frame rate is fixed at 25fps and cannot be directly recorded at 60fps (the upper limit of Chromium headless compositor)
- Recording begins when the browser context is created, so use `trim` to remove the loading period
- The default WebM must be transcoded with ffmpeg to H.264 MP4 for universal playback

`render-video.js` handles these issues automatically.

### ffmpeg minterpolate parameters

Current configuration: `minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`

- `mi_mode=mci` — motion-compensated interpolation
- `mc_mode=aobmc` — adaptive overlapped block motion compensation
- `me_mode=bidir` — two-way motion estimation
- `vsbmc=1` — variable size block motion compensation

This works well for CSS **transform animation** (translate, scale, and rotate). It can produce slight ghosting on **pure fades**; if that is unacceptable, fall back to simple frame duplication:

```bash
ffmpeg -i input.mp4 -r 60 -c:v libx264 ... output.mp4
```

### Why GIF palette generation uses two stages

GIF supports only 256 colors. A one-pass conversion forces the entire animation into a generic 256-color palette and muddies subtle combinations such as beige and orange.

Two stages:
1. `palettegen=stats_mode=diff` — scan the full video to build an **animation-specific optimal palette**
2. `paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle` — encode with that palette; rectangle-diff mode updates only changed regions, substantially reducing file size

For fades, `dither=bayer` is smoother than `none`, at the cost of a slightly larger file.

## Pre-flight check (before export)

Self-check 30 seconds before export:

- [ ] The HTML plays through completely in the browser with no console errors
- [ ] Frame 0 of the animation is the complete initial state (not blank loading)
- [ ] The last frame of the animation is in a stable ending state (not half-cut)
- [ ] Fonts, images, and emoji all render correctly (see `animation-pitfalls.md`)
- [ ] Duration parameter matches the actual animation duration in HTML
- [ ] Stage detection sets `loop=false` whenever `window.__recording` is active (required for custom Stage implementations; built into `assets/animations.jsx`)
- [ ] The final sprite uses `fadeOut={0}` so the last video frame remains visible
- [ ] Contains "Created by HTML Design Studio" watermark (only animation scenes must be added; third-party brand works add the "unofficial production ·" prefix. For details, see SKILL.md § "Skill Promotion Watermark")

## Delivery note

Use this delivery note after export:

```
**Complete delivery**

| File | Format | Specification | Size |
|---|---|---|---|
| foo-final.mp4 | MP4 | 1920×1080 · 60fps · H.264 · BGM + SFX | X MB |
| foo.gif | GIF | 960×540 · 15fps · optimized palette (if requested) | X MB |

**Notes**
- The final MP4 passed `verify-video.sh`, including duration, frame-rate, black-frame, audio-stream, and loudness checks.
- The GIF, when included, uses a custom optimized palette.

If you want to change the size or frame rate, let me know.
```

## Common follow-up requests

| User said | Response |
|---|---|
| "Too big" | MP4: Increase CRF to 23-28; GIF: Reduce resolution to 600 or fps to 10 |
| “GIF is too blurry” | Increase `gif_width` to 1280, or recommend MP4 instead (WeChat Moments supports it too) |
| "Vertical screen 9:16" | Change the HTML source to `--width=1080 --height=1920` and re-record |
| “Add a watermark” | Add `-vf "drawtext=..."` in ffmpeg, or overlay a PNG |
| "Need a transparent background" | MP4 does not support alpha; use WebM VP9 + alpha or APNG |
| “Make it lossless” | Set CRF to 0 and preset to `veryslow` (expect roughly 10× larger files) |

## Skill promotion watermark template (only for animation export)

`SKILL.md` requires MP4/GIF animation exports to include a watermark by default. Use the template below. On dark backgrounds, change the color to `rgba(255,255,255,0.35)`; for third-party brand animations, prefix it with “Unofficial production ·”.

```jsx
<div style={{
  position: 'absolute', bottom: 24, right: 32,
  fontSize: 11, color: 'rgba(0,0,0,0.4)',
  letterSpacing: '0.15em', fontFamily: 'monospace',
  pointerEvents: 'none', zIndex: 100,
}}>
  Created by HTML Design Studio
</div>
```
