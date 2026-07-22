# Apple Gallery Showcase · Animated Gallery-Wall Style

> Inspiration: the Claude Design website hero video + the gallery-wall presentation on Apple product pages
> Proven in: html-design-studio launch hero v5
> Best for: **product-launch hero animation, skill-capability demonstrations, and portfolio showcases**—any situation that presents several high-quality outputs at once while guiding the audience's attention

---

## When to Use This Style

**Good fit:**
- Ten or more genuine outputs need to appear together: slides, apps, websites, or infographics.
- The audience is professional—developers, designers, or product managers—and sensitive to finish quality.
- The intended character is restrained, exhibition-like, sophisticated, and spatial.
- Detail and overview must coexist: the viewer should inspect one item without losing the whole.

**Poor fit:**
- A single-product focus; use the product-hero template from `frontend-design`.
- Emotional or strongly narrative animation; use a timeline narrative template.
- Small screens or portrait orientation; the oblique perspective becomes muddy at small sizes.

---

## Core Visual Tokens

```css
:root {
  /* Light gallery palette */
  --bg:         #F5F5F7;   /* Main canvas — Apple website gray */
  --bg-warm:    #FAF9F5;   /* Warm off-white alternative */
  --ink:        #1D1D1F;   /* Primary text */
  --ink-80:     #3A3A3D;
  --ink-60:     #545458;
  --muted:      #86868B;   /* Secondary text */
  --dim:        #C7C7CC;
  --hairline:   #E5E5EA;   /* 1px card border */
  --accent:     #D97757;   /* Terracotta orange — Claude brand */
  --accent-deep:#B85D3D;

  --serif-cn: "Noto Serif SC", "Songti SC", Georgia, serif;
  --serif-en: "Source Serif 4", "Tiempos Headline", Georgia, serif;
  --sans:     "Inter", -apple-system, "PingFang SC", system-ui;
  --mono:     "JetBrains Mono", "SF Mono", ui-monospace;
}
```

**Key principles:**
1. **Never use a pure black background.** Black makes the work feel cinematic rather than like a practical deliverable that could be adopted.
2. **Terracotta orange is the only chromatic accent**; everything else is grayscale and white.
3. **A multi-role type stack**—English serif + Chinese serif + sans + mono—creates the character of a publication rather than an internet product.

---

## Core Layout Patterns

### 1. Floating Card: the Style's Basic Unit

```css
.gallery-card {
  background: #FFFFFF;
  border-radius: 14px;
  padding: 6px;                          /* Inner padding acts as mounting board */
  border: 1px solid var(--hairline);
  box-shadow:
    0 20px 60px -20px rgba(29, 29, 31, 0.12),   /* Main shadow: soft and long */
    0 6px 18px -6px rgba(29, 29, 31, 0.06);     /* Near-light layer creates lift */
  aspect-ratio: 16 / 9;                  /* Consistent slide ratio */
  overflow: hidden;
}
.gallery-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  border-radius: 9px;                    /* Slightly smaller radius creates visual nesting */
}
```

**Counterexample:** do not use edge-to-edge tiles without padding, border, or shadow. That language expresses infographic density, not an exhibition.

### 2. Oblique 3D Gallery Wall

```css
.gallery-viewport {
  position: absolute; inset: 0;
  overflow: hidden;
  perspective: 2400px;                   /* Deep perspective keeps tilt controlled */
  perspective-origin: 50% 45%;
}
.gallery-canvas {
  width: 4320px;                         /* Canvas = 2.25× viewport */
  height: 2520px;                        /* Leave room for panning */
  transform-origin: center center;
  transform: perspective(2400px)
             rotateX(14deg)              /* Tilt backward */
             rotateY(-10deg)             /* Turn left */
             rotateZ(-2deg);             /* Slight roll breaks mechanical regularity */
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 40px;
  padding: 60px;
}
```

**Parameter sweet spots:**
- `rotateX`: 10–15 deg; more resembles a VIP event backdrop.
- `rotateY`: ±8–12 deg; maintains left/right balance.
- `rotateZ`: ±2–3 deg; introduces a human “this was not placed by a machine” quality.
- `perspective`: 2000–2800 px; below 2000 becomes fisheye, above 3000 approaches orthographic projection.

### 3. 2 × 2 Four-Corner Convergence for Selection Scenes

```css
.grid22 {
  display: grid;
  grid-template-columns: repeat(2, 800px);
  gap: 56px 64px;
  align-items: start;
}
```

Each card slides and fades in from its corresponding corner—top-left, top-right, bottom-left, or bottom-right. The corresponding `cornerEntry` vectors:

```js
const cornerEntry = {
  tl: { dx: -700, dy: -500 },
  tr: { dx:  700, dy: -500 },
  bl: { dx: -700, dy:  500 },
  br: { dx:  700, dy:  500 },
};
```

---

## Five Core Animation Patterns

### Pattern A · Four-Corner Convergence (0.8–1.2 s)

Four elements slide in from the viewport corners while scaling from 0.85 → 1.0 with ease-out timing. Best for an opening that presents choices from multiple directions.

```js
const inP = easeOut(clampLerp(t, start, end));
card.style.transform = `translate3d(${(1-inP)*ce.dx}px, ${(1-inP)*ce.dy}px, 0) scale(${0.85 + 0.15*inP})`;
card.style.opacity = inP;
```

### Pattern B · Enlarge Selection + Slide Others Away (0.8 s)

The selected card scales from 1.0 → 1.28. Every other card fades, blurs, and drifts back toward its corner:

```js
// Selected card
card.style.transform = `translate3d(${cellDx*outP}px, ${cellDy*outP}px, 0) scale(${1 + 0.28*easeOut(zoomP)})`;
// Unselected cards
card.style.opacity = 1 - outP;
card.style.filter = `blur(${outP * 1.5}px)`;
```

**Critical:** unselected cards must blur, not merely fade. Blur simulates depth of field and visually pushes the selected card forward.

### Pattern C · Ripple Reveal (1.7 s)

Starting at the center and delaying by distance, each card fades in while the whole wall scales from 1.25× to 0.94×, as if the camera were pulling back:

```js
const col = i % COLS, row = Math.floor(i / COLS);
const dc = col - (COLS-1)/2, dr = row - (ROWS-1)/2;
const dist = Math.sqrt(dc*dc + dr*dr);
const delay = (dist / maxDist) * 0.8;
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
card.style.opacity = easeOut(Math.min(1, localT));

// Simultaneously scale the whole wall from 1.25 → 0.94
const galleryScale = 1.25 - 0.31 * easeOut(rippleProgress);
```

### Pattern D · Sinusoidal Pan: Continuous Drift

Combine sine-wave motion with linear drift to avoid the obvious “start and end” loop of a marquee:

```js
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;    // Drift left
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;    // Drift upward
const clampedX = Math.max(-900, Math.min(900, panX));   // Prevent exposed edges
```

**Parameters:**
- Sine frequency `0.09–0.15 rad/s`: slow, roughly one oscillation every 30–50 seconds.
- Linear drift `5–8 px/s`: slower than the viewer's blink.
- Amplitude `120–220 px`: large enough to register, small enough to avoid motion sickness.

### Pattern E · Focus Overlay

**Key design decision:** the focus overlay is a **flat element**, not tilted, floating above the oblique canvas. The selected slide expands from its tile position at roughly 400 × 225 to 960 × 540 in the center. The background canvas keeps its tilt but **dims to 45%**:

```js
// Focus overlay: flat and centered
focusOverlay.style.width = (startW + (endW - startW) * focusIntensity) + 'px';
focusOverlay.style.height = (startH + (endH - startH) * focusIntensity) + 'px';
focusOverlay.style.opacity = focusIntensity;

// Dim background cards while keeping them visible—critical: never use a 100% mask
card.style.opacity = entryOp * (1 - 0.55 * focusIntensity);   // 1 → 0.45
card.style.filter = `brightness(${1 - 0.3 * focusIntensity})`;
```

**Sharpness rules:**
- The focus overlay's `<img>` must point directly to the original image. **Never reuse the gallery's compressed thumbnail.**
- Preload every original into a `new Image()[]` array.
- Calculate the overlay's `width` and `height` frame by frame so the browser resamples the original image each frame.

---

## Timeline Architecture: Reusable Skeleton

```js
const T = {
  DURATION: 25.0,
  s1_in: [0.0, 0.8],    s1_type: [1.0, 3.2],  s1_out: [3.5, 4.0],
  s2_in: [3.9, 5.1],    s2_hold: [5.1, 7.0],  s2_out: [7.0, 7.8],
  s3_hold: [7.8, 8.3],  s3_ripple: [8.3, 10.0],
  panStart: 8.6,
  focuses: [
    { start: 11.0, end: 12.7, idx: 2  },
    { start: 13.3, end: 15.0, idx: 3  },
    { start: 15.6, end: 17.3, idx: 10 },
    { start: 17.9, end: 19.6, idx: 16 },
  ],
  s4_walloff: [21.1, 21.8], s4_in: [21.8, 22.7], s4_hold: [23.7, 25.0],
};

// Core easing
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
function lerp(time, start, end, fromV, toV, easing) {
  if (time <= start) return fromV;
  if (time >= end) return toV;
  let p = (time - start) / (end - start);
  if (easing) p = easing(p);
  return fromV + (toV - fromV) * p;
}

// One render(t) function reads the timestamp and writes every element
function render(t) { /* ... */ }
requestAnimationFrame(function tick(now) {
  const t = ((now - startMs) / 1000) % T.DURATION;
  render(t);
  requestAnimationFrame(tick);
});
```

**Architectural essence:** **derive every state from timestamp `t`**. Do not use a state machine or `setTimeout`. This provides:
- Instant seeking with `window.__setTime(12.3)`, convenient for frame-by-frame Playwright captures.
- Naturally seamless loops through `t mod DURATION`.
- The ability to freeze any frame while debugging.

---

## Finish Details That Are Easy to Miss but Decisive

### 1. SVG Noise Texture

The greatest danger on a light background is flatness. Add an extremely subtle `fractalNoise` layer:

```html
<style>
.stage::before {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.078  0 0 0 0 0.078  0 0 0 0 0.074  0 0 0 0.035 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  opacity: 0.5;
  pointer-events: none;
  z-index: 30;
}
</style>
```

It seems invisible until you remove it; then its contribution becomes obvious.

### 2. Corner Brand Label

```html
<div class="corner-brand">
  <div class="mark"></div>
  <div>HTML DESIGN STUDIO</div>
</div>
```

```css
.corner-brand {
  position: absolute; top: 48px; left: 72px;
  font-family: var(--mono);
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--muted);
}
```

Show it only during the gallery-wall scene and fade it in and out. It should resemble a museum label.

### 3. Closing Brand Wordmark

```css
.brand-wordmark {
  font-family: var(--sans);
  font-size: 148px;
  font-weight: 700;
  letter-spacing: -0.045em;   /* Negative tracking is critical: it condenses type into a mark */
}
.brand-wordmark .accent {
  color: var(--accent);
  font-weight: 500;           /* The accent character is intentionally lighter for contrast */
}
```

`letter-spacing: -0.045em` is the standard treatment for large type on Apple product pages.

---

## Common Failure Modes

| Symptom | Cause | Solution |
|---|---|---|
| Looks like a PowerPoint template | Cards have no shadow or hairline | Add the two-layer `box-shadow` and 1 px border |
| Tilt feels cheap | Only `rotateY` is present, without `rotateZ` | Add ±2–3 deg `rotateZ` to break the regularity |
| Pan appears to stutter | Loop uses `setTimeout` or CSS keyframes | Use `requestAnimationFrame` + continuous sine/cosine functions |
| Type becomes illegible during focus | Reused the gallery tile's low-resolution image | Use a separate overlay pointing directly to the original image |
| Background feels empty | Flat `#F5F5F7` color | Add SVG `fractalNoise` at 0.5 opacity |
| Typography feels too “internet” | Uses only Inter | Add serif faces for English and Chinese plus a mono role |

---

## References

- Complete implementation sample: `hero-animation-v5.html` (author's local sample; not distributed with the repository)
- Original inspiration: the hero video at `claude.ai/design`
- Aesthetic references: Apple product pages and Dribbble gallery pages

When an animation needs to present several high-quality outputs, copy the skeleton from this file directly, replace the content, and adjust the timing.
