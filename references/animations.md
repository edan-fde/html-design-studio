# Animations: Timeline Animation Engine

Read this when creating animation or motion-design HTML. It covers the principles, usage, and common patterns.

## Core Pattern: Stage + Sprite

Our animation system (`assets/animations.jsx`) provides a timeline-driven engine:

- **`<Stage>`**: the container for the entire animation. It automatically provides viewport-fitting scale, a scrubber, and play/pause/loop controls.
- **`<Sprite start end>`**: a time segment. A Sprite is visible only from `start` through `end`. Inside it, the `useSprite()` hook exposes local progress `t` from 0 → 1.
- **`useTime()`**: reads the current global time in seconds.
- **`Easing.easeInOut` / `Easing.easeOut` / ...**: easing functions.
- **`interpolate(t, from, to, easing?)`**: interpolates a value from `t`.

This pattern borrows ideas from Remotion and After Effects while remaining lightweight and dependency-free.

## Getting Started

```html
<script type="text/babel" src="animations.jsx"></script>
<script type="text/babel">
  const { Stage, Sprite, useTime, useSprite, Easing, interpolate } = window.Animations;

  function Title() {
    const { t } = useSprite();  // Local progress: 0 → 1
    const opacity = interpolate(t, [0, 1], [0, 1], Easing.easeOut);
    const y = interpolate(t, [0, 1], [40, 0], Easing.easeOut);
    return (
      <h1 style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontSize: 120,
        fontWeight: 900,
      }}>
        Hello.
      </h1>
    );
  }

  function Scene() {
    return (
      <Stage duration={10}>  {/* 10-second animation */}
        <Sprite start={0} end={3}>
          <Title />
        </Sprite>
        <Sprite start={2} end={5}>
          <SubTitle />
        </Sprite>
        {/* ... */}
      </Stage>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<Scene />);
</script>
```

## Common Animation Patterns

### 1. Fade In / Fade Out

```jsx
function FadeIn({ children }) {
  const { t } = useSprite();
  const opacity = interpolate(t, [0, 0.3], [0, 1], Easing.easeOut);
  return <div style={{ opacity }}>{children}</div>;
}
```

**Note the range**: `[0, 0.3]` means that the fade-in completes during the first 30% of the Sprite's duration, then holds at `opacity = 1`.

### 2. Slide In

```jsx
function SlideIn({ children, from = 'left' }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, 0.4], [0, 1], Easing.easeOut);
  const offset = (1 - progress) * 100;
  const directions = {
    left: `translateX(-${offset}px)`,
    right: `translateX(${offset}px)`,
    top: `translateY(-${offset}px)`,
    bottom: `translateY(${offset}px)`,
  };
  return (
    <div style={{
      transform: directions[from],
      opacity: progress,
    }}>
      {children}
    </div>
  );
}
```

### 3. Character-by-Character Typewriter

```jsx
function Typewriter({ text }) {
  const { t } = useSprite();
  const charCount = Math.floor(text.length * Math.min(t * 2, 1));
  return <span>{text.slice(0, charCount)}</span>;
}
```

### 4. Number Count-Up

```jsx
function CountUp({ from = 0, to = 100, duration = 0.6 }) {
  const { t } = useSprite();
  const progress = interpolate(t, [0, duration], [0, 1], Easing.easeOut);
  const value = Math.floor(from + (to - from) * progress);
  return <span>{value.toLocaleString()}</span>;
}
```

### 5. Segmented Explanation (Typical Educational Animation)

```jsx
function Scene() {
  return (
    <Stage duration={20}>
      {/* Phase 1: Present the problem */}
      <Sprite start={0} end={4}>
        <Problem />
      </Sprite>

      {/* Phase 2: Present the approach */}
      <Sprite start={4} end={10}>
        <Approach />
      </Sprite>

      {/* Phase 3: Present the result */}
      <Sprite start={10} end={16}>
        <Result />
      </Sprite>

      {/* Caption visible for the entire animation */}
      <Sprite start={0} end={20}>
        <Caption />
      </Sprite>
    </Stage>
  );
}
```

## Easing Functions

Built-in easing curves:

| Easing | Behavior | Use For |
|--------|------|------|
| `linear` | Constant speed | Scrolling captions, continuous motion |
| `easeIn` | Slow → fast | Exits and disappearances |
| `easeOut` | Fast → slow | Entrances and reveals |
| `easeInOut` | Slow → fast → slow | Position changes |
| **`expoOut`** ⭐ | **Exponential ease-out** | **Primary Anthropic-quality easing** (a sense of physical weight) |
| **`overshoot`** ⭐ | **Elastic rebound** | **Toggles / button pops / interaction emphasis** |
| `spring` | Spring motion | Interaction feedback, geometry settling into place |
| `anticipation` | Briefly moves backward before moving forward | Emphasized actions |

**Use `expoOut`, not `easeOut`, as the primary default easing**—see §2 of `animation-best-practices.md`.
Use `expoOut` for entrances, `easeIn` for exits, and `overshoot` for toggles. This is the foundation of Anthropic-quality motion.

## Pacing and Duration Guidelines

### Microinteractions (0.1–0.3 Seconds)
- Button hover
- Card expansion
- Tooltip appearance

### UI Transitions (0.3–0.8 Seconds)
- Page changes
- Modal appearance
- Adding a list item

### Narrative Animation (2–10 Seconds Per Segment)
- One phase of a conceptual explanation
- A data-chart reveal
- A scene transition

### Never Let a Single Narrative Segment Exceed 10 Seconds
Human attention is limited. Explain one thing in ten seconds, then move to the next.

## The Right Order for Designing Animation

### 1. Start with Content and Story, Then Add Motion

**Wrong**: think of an impressive animation first, then force content into it.
**Right**: decide what information needs to be communicated, then use motion to serve that information.

Animation is a **signal**, not **decoration**. A fade-in says, “This matters; look here.” If everything fades in, the signal stops working.

### 2. Write the Timeline Scene by Scene

```
0:00 - 0:03   Problem appears (fade in)
0:03 - 0:06   Problem enlarges/unfolds (zoom + pan)
0:06 - 0:09   Solution appears (slide in from right)
0:09 - 0:12   Solution is explained (typewriter)
0:12 - 0:15   Result demonstration (counter up + chart reveal)
0:15 - 0:18   One-sentence summary (static; allow 3 seconds to read)
0:18 - 0:20   CTA or fade out
```

Write the components only after the timeline is complete.

### 3. Prepare Assets First

Prepare every image, icon, and font needed for the animation **before** production. Do not interrupt the flow by hunting for assets halfway through.

## Common Problems

**The animation stutters**
→ The main cause is layout thrashing. Animate `transform` and `opacity`; do not animate `top`, `left`, `width`, `height`, or `margin`. Browsers accelerate `transform` on the GPU.

**The animation is too fast to read**
→ Reading one Chinese character takes 100–150 ms; reading one word takes 300–500 ms. When text carries the story, leave at least three seconds for each sentence.

**The animation is so slow that viewers become bored**
→ Meaningful visual changes must remain frequent. A static frame becomes dull after more than five seconds.

**Several animations interfere with one another**
→ Use CSS `will-change: transform` to tell the browser in advance which elements will move and reduce reflow.

**Recording as video**
→ Use the skill's built-in toolchain, which exports three formats with one command; see `video-export.md`:
- `scripts/render-video.js` — HTML → 25 fps MP4 (Playwright + ffmpeg)
- `scripts/convert-formats.sh` — 25 fps MP4 → 60 fps MP4 + optimized GIF
- Need exact frame rendering? Make `render(t)` a pure function; see rule 5 in `animation-pitfalls.md`.

## Working with Video Tools

This skill creates **HTML animation** that runs in the browser. If the final output must become video footage:

- **Short animation / concept demo**: create the HTML animation with this method → screen-record it.
- **Long-form video / narrative**: this skill focuses on HTML animation; use an AI video-generation skill or professional video software for long-form work.
- **Motion graphics**: professional tools such as After Effects or Motion Canvas are more suitable.

## Libraries Such as Popmotion

If you truly need physical animation—springs, decay, or keyframes with precise timing—and this engine cannot handle it, fall back to Popmotion:

```html
<script src="https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js"></script>
```

But **try this engine first**. It covers 90% of cases.
