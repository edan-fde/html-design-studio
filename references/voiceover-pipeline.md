# Voiceover Pipeline · Narration-driven animation

> Upgrades animation from “silent visuals + voiceover added later” to a workflow where **the narration comes first and the visuals follow the audio's measured timing**.
> Suitable for 5–20-minute concept explainers, tutorials, and long-form educational videos.
>
> Use this with `references/animation-best-practices.md`: this document governs **how narration and visuals align**; `animation-best-practices.md` governs **how each frame moves**.

---

## 🛑 Non-negotiable rule · Read before writing any code

> **The most common failure in narrated animation is a slide deck with voiceover instead of a film.**

### Rule 1 · The entire film is one continuous motion narrative, not a set of independent scenes

A slide deck consists of separate pages. This workflow creates **one continuous film lasting X minutes**.

**Identity switch**:
- ❌ You are not “creating content for seven scenes”
- ✅ You are directing one or more hero elements through an X-minute performance

**The visual skeleton is one or more hero elements that persist throughout the film**:

- They appear at t=0 and leave only at the end.
- Each cue changes its **state**—position, size, color, perspective, or form—instead of replacing it with a new element
- Scene boundaries belong in the script, **not in the frame**. The audience should not perceive “scene three”; they should see one continuous movement

**Counterexample (a real failure in skill v1, 2026-05-10)**:
- Seven `<Scene>` components had independent layouts; each transition faded the entire page from opacity 1→0 before revealing the next
- Each cue = `opacity: p, transform: translateY((1-p)*30px)` (fade-up used monotonically)
- Result: the audience's first reaction was “this feels like Keynote slides,” destroying the film's visual quality

**Correct approach**:
- Choose one or two hero elements—for example, the `md` and `html` marks in this document's demo—as the visual skeleton.
- Keep them on screen from beginning to end.
- Treat each “scene” as a state change of the hero elements.
  - opening: the two marks face each other in the center of the screen
  - md-side: `md` grows larger and heavier to occupy the frame; `html` retreats to a corner while data flows around `md`
  - html-side: `html` takes over as the protagonist; `md` retreats to the corner
  - the-real-question: both marks return to center with `≠` between them
  - the-split: the marks move to opposite sides, opening space in the middle
  - activity-proof: the two marks alternate emphasis along the timeline
  - closing: both settle into the final-answer composition
- The result is “`md` and `html` performing together for X minutes,” not seven separate slides

**Minimum implementation skeleton** (direct copy and modification):

```jsx
// ── Step 1: define each hero's target state per scene (position / size / opacity). ──
const HERO_KEYS = {
  opening:    { md: { x: 50, y: 35, scale: 1.0, opacity: 1 }, html: { x: 50, y: 65, scale: 1.0, opacity: 1 } },
  'md-side':  { md: { x: 78, y: 50, scale: 1.6, opacity: 1 }, html: { x: 92, y: 8,  scale: 0.25, opacity: 0.4 } },
  'html-side':{ md: { x: 8,  y: 8,  scale: 0.25, opacity: 0.4 }, html: { x: 22, y: 50, scale: 1.6, opacity: 1 } },
  // ...one entry per segment; motion continues from the previous segment's final state into this state.
};

// ── Step 2: easing and lerp utilities. ──
const expoOut = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const lerpPos = (from, to, t) => ({
  x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t),
  scale: lerp(from.scale, to.scale, t),
  opacity: lerp(from.opacity ?? 1, to.opacity ?? 1, t),
});

// ── Step 3: mount HeroAnchor directly under <NarrationStage>, never inside a <Scene>. ──
const HeroAnchor = () => {
  const { time, scene, timeline } = useNarration();
  if (!scene) return null;
  const idx = timeline.scenes.findIndex(s => s.id === scene.id);
  const prevId = idx > 0 ? timeline.scenes[idx - 1].id : scene.id;
  const from = HERO_KEYS[prevId];
  const to   = HERO_KEYS[scene.id];

  // Use the first ~45% of the segment to morph from the previous state; hold for the remainder.
  const transitionDur = Math.min(2.0, scene.duration * 0.45);
  const t = expoOut(Math.min(1, (time - scene.start) / transitionDur));
  const md   = lerpPos(from.md,   to.md,   t);
  const html = lerpPos(from.html, to.html, t);

  // Add subtle breathing so every frame contains motion; see Rule 3.
  const breath = 1 + Math.sin(time * 0.6) * 0.012;

  const renderHero = (label, pos, color) => (
    <div style={{
      position: 'absolute', left: `${pos.x}%`, top: `${pos.y}%`,
      transform: `translate(-50%, -50%) scale(${pos.scale * breath})`,
      opacity: pos.opacity, color, fontSize: 360, fontWeight: 800,
      lineHeight: 1, willChange: 'transform, opacity', pointerEvents: 'none',
    }}>{label}</div>
  );
  return <>
    {renderHero('md',   md,   '#1B4965')}
    {renderHero('html', html, '#C04A1A')}
  </>;
};

// ── Step 4: keep the hero under NarrationStage; manage scene-specific supporting elements separately. ──
const App = () => (
  <NarrationStage timeline={TIMELINE} audioSrc="_narration/voiceover.mp3" width={1920} height={1080}>
    <HeroAnchor />  {/* Persists across scenes as the film's visual skeleton. */}
    {/* Use useSceneFade for soft entrances/exits of supporting elements; never hard-cut them. */}
    <MdSideAux />
    <HtmlSideAux />
    {/* ... */}
  </NarrationStage>
);
```

**Complete runnable reference**: `demos/md-html-narration/md-html-demo.html` (3:21, seven segments, 21 cues, production-verified)

### Rule 2 · Never hard-cut between segments

| Wrong: slide-deck behavior | Correct: cinematic continuity |
|---|---|
| Fade all of scene A from `opacity: 1→0` while scene B fades `0→1` | Core elements from scene A **morph into scene B** through smooth changes in position, size, and color |
| Give every scene an independent layout whose elements appear and disappear | Elements **remain on screen** while their positions and forms evolve |
| Repeatedly fade subtitle strips and data cards in and out | Introduce them as the only non-hero elements, hold them, then **carry them out with the hero's movement** |

Implementation rules:
- **Shared elements across scenes** → mount the hero directly under `<NarrationStage>`; **never place it inside `<Scene>`**
- Inside the hero, read `time`, `scene`, and `isCueTriggered` from `useNarration()` and derive its current form from time
- Use `<Scene>` only for supporting elements that exist in one segment, such as data cards or reference blocks. **Do not hard-cut them**: exit with `expoOut` plus stagger and overlap the fade with the next segment

### Rule 3 · Every frame must contain motion

**Self-test**: capture **any arbitrary frame** during recording—not just the moment a cue fires.
- If the image feels **completely still**, it fails. Add underlying movement: background drift, subtle hero scaling, a camera pan, or parallax
- There is always an **underlying movement** running (even if it is not the focus):
  - hero element's `scale: 1 ↔ 1.02` 5-second breathing cycle
  - background `translateX: 0 ↔ -20px` slow drift
  - a settled data card retains a tiny `translateY` drift driven by Perlin noise
- A completely static frame feels like a slide rather than a film

### Rule 4 · Easing, stagger, and holds are the minimum standard

| Item | Required | Prohibited |
|---|---|---|
| Easing | Use `expoOut` as the workhorse (`cubic-bezier(0.16, 1, 0.3, 1)`), `overshoot` for emphasis, and `spring` for settling | `linear`, generic `ease`, CSS defaults |
| Multi-element entrance | 30ms stagger between elements | Everything appearing at once |
| Before a key cue | Hold 0.3–0.5s so the audience can register the current state before the cue fires | Moving immediately from one section into the next |
| Ending | Stop decisively and hold the final frame for one second | Fade to black |

For the detailed rules, see §1–§4 of `animation-best-practices.md`.

### Self-check · First audience reaction

After finishing, show it to someone unfamiliar with the work—or watch it yourself after 24 hours. What is the first reaction?

| Reaction | Rating | Action |
|---|---|---|
| "This is a PPT with dubbing" | Failure | Go back and redo |
| “The visuals switch when the audio changes” | Failure | No continuous narrative; the hero is absent or does not persist |
| “It moves” | Pass | Motion exists, but there is no memorable moment |
| "I want to finish it" | Good | The rhythm is right |
| “I want to capture this frame” | Excellent | The film is working |

---

## Workflow (high-level)

```
                ┌──────────────────────────┐
                │  Narration script.md        │
                │  ## scene headings +        │
                │  [[cue:xx]] markers         │
                └──────────────┬───────────┘
                               │
                  narrate-pipeline.mjs
                               │
                               ▼
            ┌──────────────────────────────┐
            │ voiceover.mp3 (complete narration) │
            │ timeline.json (measured timing)    │
            └──────────────┬───────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
    ┌─────────────────┐      ┌──────────────────┐
    │ HTML animation     │      │ MP4 recording + mix │
    │ (NarrationStage)   │      │ render-narration     │
    │ Live audio sync    │      │ → final release MP4  │
    └─────────────────┘      └──────────────────┘
       Delivery format 1              Delivery format 2
```

## Narration-script format

Place it anywhere in the project directory. The file name is recommended `script.md`:

```markdown
---
title: What Is an LLM?
voice: S_JSdgdWk22   # Optional; overrides the default voice in .env.
speed: 1.0           # Optional; range 0.5–2.0.
gap: 0.4             # Silence between segments in seconds; default 0.3.
---

## intro
In five minutes, we will explain exactly what an LLM is.

## what-is
LLM stands for Large Language Model. [[cue:bigmodel]]It is a neural network with hundreds of billions of parameters.
At heart, it predicts what text should come next.

## demo
For example, if you enter “today's weather,” [[cue:input]]the model predicts the most likely next word.
[[cue:predict]]It might be “looks great” or “isn't bad.”
```

**Rules**:
- A section heading is `## scene-id`, using Latin letters, numbers, and hyphens—for example `## what-is` or `## scene-1`
- Place `[[cue:xx]]` inside the key sentence. The pipeline splits the text at that position; the moment immediately after the marker becomes the visual trigger
- Listen for the cue ID in the animation HTML with `<Cue id="xx">`
- Write for speech: use rhythm and short sentences. Long sentences become flat in TTS

## `timeline.json` schema

```ts
{
  title: string,
  voice: string | null,
  speed: number,
  gap: number,
  totalDuration: number,        // Measured duration of the complete voiceover.mp3, in seconds.
  voiceover: 'voiceover.mp3',   // Path relative to timeline.json.
  scenes: [
    {
      id: string,
      start: number,            // Segment start within the full audio track.
      end: number,
      duration: number,
      audio: 'audio/<id>.mp3',  // Separate audio for this segment, after concatenating its cue-level pieces.
      text: string,             // Full segment text with [[cue:xx]] markers removed.
      // chunks drive subtitle display. Each is a cue-delimited subsegment with a measured TTS time window.
      chunks: [
        {
          text: string,            // Subsegment text.
          start: number,           // Time relative to this segment.
          end: number,
          absoluteStart: number,   // Absolute track time, aligned to voiceover.mp3.
          absoluteEnd: number,
          // words: word-level timestamps returned by TTS enable_subtitle; included by default.
          // Disable with --no-timestamps. Text is post-TN; punctuation attaches to the preceding token.
          words: [
            { text: string, start: number, end: number, absoluteStart: number, absoluteEnd: number }
          ],
        }
      ],
      cues: [
        {
          id: string,
          offset: number,       // Time relative to this segment.
          absoluteTime: number, // Absolute time on the full timeline.
        }
      ]
    }
  ]
}
```

`absoluteTime` and `absoluteStart`/`absoluteEnd` are **measured values**. The pipeline divides each segment at cue markers, synthesizes those pieces, and accumulates their measured durations. **It does not estimate timing linearly from character count.**

## Subtitles

> **Subtitles are enabled by default.** Long narrated videos without subtitles suffer significantly lower retention. `NarrationStage` provides `<Subtitles />` out of the box.

### Usage (one line)

```jsx
const { NarrationStage, Subtitles } = NarrationStageLib;
<NarrationStage timeline={TIMELINE} audioSrc="...">
  {/* Your hero / scene content */}
  <Subtitles />  {/* Reads active text from timeline.scenes[].chunks automatically. */}
</NarrationStage>
```

### Visual rules (Bilibili-style, anti-PowerPoint)

| Item | Rules | Counterexample |
|---|---|---|
| Background | **No background** (no black horizontal bars, no backdrop-blur) | Translucent black background + blur = subtitle bar suppresses the screen = PPT feeling |
| Text color | **Dark Ink `#1a1a1a` with a white halo on light backgrounds**; white text with a black halo on dark backgrounds | White text with a black stroke on a light background blurs the letterforms |
| Font size | 32px for 1080p video | Below 24px is unreadable; above 40px competes with the main visual |
| Font | `PingFang SC` / `Noto Sans SC` for Chinese-language content | Serif type reads like cinematic subtitles |
| Position | `bottom: 90px`, clear of the edge | Text touching the bottom edge looks cheap |
| Single-line length | **Use `maxLen={12}` for delivery**. The runtime default is 13 visual units: about 13 CJK glyphs or 26 Latin alphanumeric characters | More than 15 CJK-equivalent units is unreadable on mobile |
| Segmentation | **Keep sentence boundaries intact**. CJK text wraps at character boundaries after English/CJK strong punctuation; English and other Latin-script text wraps at word boundaries. Hard-wrap only an indivisible token that exceeds `maxLen` | Splitting only by character count and breaking a phrase or English word mid-thought |

`<Subtitles />` uses the runtime default of 13 visual units. To follow the skill's delivery recommendation, use `<Subtitles maxLen={12} />`. For a dark scene, also set `<Subtitles maxLen={12} color="#fff" haloColor="rgba(0,0,0,0.85)" />`.

### Karaoke mode (word/character-level highlighting)

```jsx
<Subtitles karaoke />                          {/* Highlight the current token in brand orange #e8590c. */}
<Subtitles karaoke karaokeColor="#0a84ff" />   {/* Custom highlight color. */}
```

- Uses word/character timestamps in each timeline chunk. `narrate-pipeline.mjs` emits them by default through Doubao TTS v3 `enable_subtitle`; this requires a 2.0 resource and supports Chinese and English.
- Displays the full line while advancing the highlight token by token. Line splitting still obeys `maxLen` and never crosses a sentence boundary; token timing remains aligned to pronunciation
- If a chunk has no `words`, it falls back automatically to standard chunk mode; callers need no special handling

### Sentence segmentation algorithm (already built in narration_stage.jsx)

```js
splitChunkToLines(text, maxLen = 13)
// 1. Split after strong English/CJK punctuation (.!?。！？ and newlines).
// 2. Keep a sentence intact when its visual length is ≤ maxLen.
// 3. Otherwise wrap Latin text at word boundaries and CJK text at character boundaries.
// 4. Hard-wrap only an indivisible token that is longer than maxLen.
// Visual width: CJK glyphs count as 1 unit; Latin letters and numerals count as 0.5 unit.
```

If the resulting lines are clearly too long or too short, **move the cue marker in the narration script** so the paragraph is divided into smaller chunks. Do not patch the front-end segmentation logic for one script.

## NarrationStage API

```jsx
import 'assets/narration_stage.jsx';
const { NarrationStage, Scene, Cue, useNarration } = NarrationStageLib;

<NarrationStage
  timeline={TIMELINE}                  // Contents of timeline.json.
  audioSrc="_narration/voiceover.mp3"  // Path relative to the current HTML file.
  width={1920} height={1080}
  background="#f5f1e8"
  controls={true}                      // Show the bottom playback controls in live-preview mode.
>
  {/* Hero persists across scenes, so mount it directly under NarrationStage. */}
  <HeroAnchor />

  {/* Scene-specific supporting elements. */}
  <Scene id="intro">
    <Cue id="bigmodel">{(triggered, progress) => (
      <SomeElement style={{ opacity: progress }} />
    )}</Cue>
  </Scene>
</NarrationStage>
```

**Hooks**:
- `useNarration()` returns `{ time, scene, sceneTime, isCueTriggered, cueProgress }` for the active segment
- Read it directly inside custom components instead of threading these values through props

**`Scene` component**:
- By default, a scene mounts only while it is active
- Add `keepMounted` to keep it mounted continuously, which is useful for animation that crosses scene boundaries

**`Cue` component**:
- `children` must be `(triggered, progress) => ReactNode`
- `progress` ramps from 0→1 after the cue fires; the default ramp lasts 0.6s

## Time sources: preview and recording

NarrationStage automatically detects `window.__recording`:
- **Live-preview mode** (default): follows the audio element's `currentTime`, so pause and seek remain synchronized
- **Video-recording mode** (`render-video.js` sets `window.__recording = true`): starts a wall-clock rAF driver at zero and exposes `window.__seek(t)` for the renderer

## Pipeline scripts

| script | input | output |
|---|---|---|
| `scripts/tts-doubao.mjs` | single text | single mp3 + measured duration |
| `scripts/narrate-pipeline.mjs` | Narration `.md` | `voiceover.mp3` + `timeline.json` |
| `scripts/mix-voiceover.sh` | Video + voiceover.mp3 [+ BGM] | MP4 with audio |
| `scripts/render-narration.sh` | Animation HTML + timeline.json | Final MP4 in one recording-and-mixing step |

## `.env` configuration

Place `.env` in the skill root and keep it gitignored:

```
DOUBAO_TTS_API_KEY=<your_api_key>
DOUBAO_TTS_VOICE_ID=zh_female_xiaohe_uranus_bigtts
DOUBAO_TTS_ENDPOINT=https://openspeech.bytedance.com/api/v3/tts/unidirectional
```

You can alternatively use the console's App ID plus Access Token authentication:

```
DOUBAO_APP_ID=<your_app_id>
DOUBAO_ACCESS_KEY=<your_access_token>
DOUBAO_TTS_VOICE_ID=zh_female_xiaohe_uranus_bigtts
```

`DOUBAO_TTS_RESOURCE_ID` is inferred from the voice ID by default: cloned voices beginning with `S_` use `seed-icl-1.0`; official `uranus` voices use `seed-tts-2.0`; other official voices use `seed-tts-1.0`.

## Standard workflow (10 steps)

1. **Write the narration script**: the script is the source code. Write every spoken segment in full under a `## scene-id` heading, and place `[[cue:xx]]` immediately before each key phrase
2. **Run the narration pipeline**: `node scripts/narrate-pipeline.mjs --script script.md --out-dir _narration`
3. **Listen to the entire `voiceover.mp3`**: if the pacing is wrong, revise the script. **This step sets the quality ceiling for the entire film**
4. **🛑 Answer the non-negotiable questions before designing**: What is the hero element? What state does it occupy in each segment? How does it morph across boundaries? If you cannot answer, do not write code
5. **Write the animation HTML**: use `NarrationStage` and one or more hero elements that perform across scenes
6. **Preview live**: open the HTML, click ▶ Play, and watch while listening for visual/narration synchronization
7. **Run the first-audience self-check**: score the work using the table above. If it fails, return to Step 4 and redesign
8. **Render video**: `bash scripts/render-narration.sh demo.html --timeline=_narration/timeline.json` records a silent MP4 and mixes in the narration automatically
9. **Optional BGM**: add `--bgm-mood=educational` (or `tech`, `tutorial`, etc.) to `render-narration.sh`
10. **Deliver**: browser HTML for live playback plus final MP4 for publishing

## Exception handling

| Problem | Solution |
|---|---|
| TTS API error | Check `.env`: verify `DOUBAO_TTS_API_KEY`, or the combination of `DOUBAO_APP_ID` and `DOUBAO_ACCESS_KEY` |
| One audio segment is clearly too long or short for its text | Unusual punctuation or emoji may be confusing TTS parsing → revise the script |
| A cue's `absoluteTime` is inaccurate | ffmpeg may be introducing inconsistency while concatenating cue-level pieces → verify that every MP3 uses the same encoding settings |
| Video render is black | `render-video.js` did not receive `window.__ready` → confirm that `NarrationStage` mounted correctly |
| Video render freezes | The animation contains expensive layout/paint effects such as many `box-shadow` or `blur` layers → simplify or precompose |
| Live audio and visuals drift out of sync | Audio-element loading delay → add `preload="auto"` or preload locally |

## When not to use this pipeline

- **Short animation under 60 seconds**: make a silent animation and add narration afterward (`add-music.sh` plus separate TTS); no timeline driver is needed
- **Pure BGM video**: Use `add-music.sh` to add preset BGM
- **Human-recorded narration**: replace `voiceover.mp3` with the recording. Write the timeline manually, or measure segment durations with ffprobe and generate it with a helper script; the rest of the workflow is unchanged.

---

**Last reminder**: Return to the iron rule before writing code. **Don’t make a PowerPoint with voiceover**.
