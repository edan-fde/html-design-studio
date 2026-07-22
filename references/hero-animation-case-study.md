# Gallery Ripple + Multi-Focus · Scene-Composition Philosophy

> A reusable visual-composition pattern distilled from huashu-design hero animation v9 (25 seconds, 8 scenes).
> This is not a step-by-step animation tutorial. It explains **when this composition is the right choice**.
> The pattern was distilled from v9. Current runnable reference: [hero-animation-v10-en.html](../demos/hero-animation-v10-en.html) · [public hero page](https://www.huasheng.ai/huashu-design-hero/)

## In one sentence

> **When you have 20+ visually consistent assets and need to convey both scale and depth, favor the Gallery Ripple + Multi-Focus composition over a stacked layout.**

This structure works reliably for SaaS feature animations, product launches, skill promotions, and portfolio-series showcases—as long as there are enough assets and their visual language is consistent.

---

## What does this technique express?

This is not merely a way to display assets. It creates a narrative through **two shifts in rhythm**:

**First beat · Ripple expansion (~1.5s)**: 48 cards spread outward from the center. Their density creates an immediate sense of scale: “This system can produce a great deal.”

**Second beat · Multi-Focus (~8s, 4 cycles)**: As the camera pans slowly, the background dims and desaturates four times while one card at a time enlarges into the center. The audience moves from the impact of quantity to a focused examination of quality, in a steady 1.7-second rhythm.

**Core narrative structure**: **Scale (Ripple) → Gaze (Focus × 4) → Fade-out (Wall-off)**. Together, these three beats express “breadth × depth”: the system can produce a great deal, and every individual result deserves a closer look.

Compare the counterexample:

| Practice | Audience perception |
|------|---------|
| Static arrangement of 48 cards (no Ripple) | Good-looking but no narrative, like a grid screenshot |
| Rapid one-by-one cuts with no gallery context | Feels like a slideshow and loses the sense of scale |
| Ripple without Focus | Creates impact, but leaves no individual image in memory |
| **Ripple + Focus × 4 (this recipe)** | **First impressed by quantity, then invited to study quality, and finally given a calm fade-out—a complete emotional arc** |

---

## Prerequisites (all must be met)

This composition is **not universal**. All four prerequisites below are essential:

1. **At least 20 images, preferably 30 or more**
   With fewer than 20 images, the Ripple feels empty. Its density comes from motion across all 48 grid cells. v9 uses 48 cells filled cyclically from 32 images.

2. **The visual style of the materials is consistent**
   Use all 16:9 slide previews, all app screenshots, or all cover designs—the aspect ratio, palette, and composition should read as one coherent set. Mixing unrelated formats makes the Gallery look like a clipboard.

3. **There is still readable information after the material is enlarged alone**
   Focus enlarges one card to 960px wide. If the source is blurry or lacks detail at that size, the shot has no value. A useful reverse test: can you choose four of the 48 images as the strongest representatives? If not, the asset quality is too uneven.

4. **The composition is landscape or square, not vertical**
   The gallery's 3D tilt (`rotateX(14deg) rotateY(-10deg)`) needs horizontal breadth. A vertical frame makes the same perspective feel cramped and unstable.

**Backup path for missing conditions**:

| Missing prerequisite | Recommended fallback |
|-------|-----------|
| Fewer than 20 images | Use a static row of three to five images, then focus them one by one |
| Inconsistent style | Use a Keynote-style “cover + three chapter images” structure instead |
| Sparse information | Use a data-driven dashboard or a pull quote with large typography instead |
| Vertical screen scene | Use "vertical scroll + sticky cards" |

---

## Technical recipe (production parameters from v9)

### 4-Layer structure

```
viewport (1920×1080, perspective: 2400px)
  └─ canvas (4320×2520, oversized overflow) → 3D tilt + pan
      └─ 8×6 grid = 48 cards (gap 40px, padding 60px)
          └─ img (16:9, border-radius 9px)
      └─ focus-overlay (absolute center, z-index 40)
          └─ img (matches selected slide)
```

**Key**: The canvas is 2.25× larger than the viewport, so the pan suggests glimpses into a world extending beyond the frame.

### Ripple expansion (distance delay algorithm)

```js
// Each card's entrance time = distance from center × 0.8s delay
const col = i % 8, row = Math.floor(i / 8);
const dc = col - 3.5, dr = row - 2.5;       // offset from center
const dist = Math.hypot(dc, dr);
const maxDist = Math.hypot(3.5, 2.5);
const delay = (dist / maxDist) * 0.8;       // 0 → 0.8s
const localT = Math.max(0, (t - rippleStart - delay) / 0.7);
const opacity = expoOut(Math.min(1, localT));
```

**Core parameters**:
- Total duration 1.7s (`T.s3_ripple: [8.3, 10.0]`)
- Maximum delay 0.8s (center enters first; corners enter last)
- Each card entry duration 0.7s
- Easing: `expoOut` (an explosive release rather than a gentle glide)

**Simultaneous move**: scale the canvas from 1.25 → 0.94, creating a synchronized pull-back reveal.

### Multi-Focus (4 beats)

```js
T.focuses = [
  { start: 11.0, end: 12.7, idx: 2  },  // 1.7s
  { start: 13.3, end: 15.0, idx: 3  },  // 1.7s
  { start: 15.6, end: 17.3, idx: 10 },  // 1.7s
  { start: 17.9, end: 19.6, idx: 16 },  // 1.7s
];
```

**Rhythm regularity**: 1.7s for each focus, 0.6s breath interval. Total 8s (11.0–19.6s).

**Within each focus beat**:
- In ramp: 0.4s (`expoOut`)
- Hold: Middle 0.9s (`focusIntensity = 1`)
- Out ramp: 0.4s (`easeOut`)

**Background change (this is the key)**:

```js
if (focusIntensity > 0) {
  const dimOp = entryOp * (1 - 0.6 * focusIntensity);  // dim to 40%
  const brt = 1 - 0.32 * focusIntensity;                // brightness 68%
  const sat = 1 - 0.35 * focusIntensity;                // saturate 65%
  card.style.filter = `brightness(${brt}) saturate(${sat})`;
}
```

**Do not change opacity alone—desaturate and darken simultaneously.** This makes the foreground overlay pop forward instead of merely looking brighter.

**Focus overlay size animation**:
- From 400×225 (entrance) → 960×540 (hold state)
- Use three shadow layers plus a 3px accent outline to create a deliberately framed presentation

### Pan (continuous motion keeps a static gallery alive)

```js
const panT = Math.max(0, t - 8.6);
const panX = Math.sin(panT * 0.12) * 220 - panT * 8;
const panY = Math.cos(panT * 0.09) * 120 - panT * 5;
```

- Combine a sine wave with linear drift. Because it is not a pure loop, the position differs at every moment.
- Use different X/Y frequencies (0.12 vs 0.09) to avoid an obviously repeating cycle.
- Clamp at ±900/500px to prevent the canvas from drifting out of range.

**Why not use a purely linear pan?** Viewers quickly predict where a linear move is going. Sine plus drift keeps each moment subtly different, while the 3D tilt adds a slight, attention-holding sense of vertigo.

---

## Five reusable patterns distilled from v6–v9

### 1. **expoOut as main easing, not cubicOut**

`easeOut = 1 - (1-t)³` (smooth) vs `expoOut = 1 - 2^(-10t)` (rapid convergence after bursting).

**Why choose it**: `expoOut` reaches roughly 90% of its destination in the first 30% of the motion. That resembles physical damping and gives the impression of a heavy object settling into place. It is especially suitable for:
- Weighted card entrances
- Shock-wave ripple expansion
- Brand marks settling into place

**When to keep `cubicOut`**: focus exit ramps and symmetrical micro-motion.

### 2. **Paper base color + terracotta orange accent (Anthropic origin)**

```css
--bg: #F7F4EE;        /* Warm paper */
--ink: #1D1D1F;       /* Almost black */
--accent: #D97757;    /* Terracotta orange */
--hairline: #E4DED2;  /* Warm lines */
```

**Why**: a warm background retains material presence after GIF compression, while pure white feels like an unstyled screen. Terracotta is the sole accent across the terminal prompt, directory-card selection, cursor, brand mark, and focus ring, tying every visual anchor together.

**Lesson from v5**: A noise overlay was added to simulate paper texture, but because every frame differed, GIF compression became ineffective. v6 switched to background color plus warm shadows, preserving roughly 90% of the paper feel while reducing the GIF size by 60%.

### 3. **Simulate depth with shadow levels instead of full 3D**

```css
.gallery-card.depth-near { box-shadow: 0 32px 80px -22px rgba(60,40,20,0.22), ... }
.gallery-card.depth-far  { box-shadow: 0 14px 40px -16px rgba(60,40,20,0.10), ... }
```

Use the deterministic expression `sin(i × 1.7) + cos(i × 0.73)` to assign near, middle, or far shadow depth to each card. **The result reads as three-dimensional stacking even though each card's transform remains unchanged, adding effectively no per-frame transform cost.**

**The cost of true 3D**: Giving every card its own `translateZ` makes the GPU calculate 48 transforms and shadow blurs on every frame. In v4, Playwright struggled to record at 25fps. The visual difference from v6's shadow-depth simulation is under 5%, while the performance cost is roughly 10× higher.

### 4. **`font-variation-settings` feels more cinematic than changing type size**

```js
const wght = 100 + (700 - 100) * morphP;  // 100 → 700 over 0.9s
wordmark.style.fontVariationSettings = `"wght" ${wght.toFixed(0)}`;
```

The brand wordmark transitions from Thin → Bold over 0.9s, paired with a subtle letter-spacing adjustment (-0.045 → -0.048em).

**Why it is better than zooming in and out**:
- Zooming is so familiar that viewers anticipate it immediately.
- Increasing weight makes the wordmark feel as though it is filling from within rather than moving closer to the camera.
- Variable fonts only became mainstream in the 2020s, so audiences often read the effect as distinctly modern.

**Constraint**: use a variable font such as Inter, Roboto Flex, or Recursive. A static family can only approximate the effect by switching fixed weights, which introduces visible jumps.

### 5. **A quiet persistent corner brand**

A small `HUASHU · DESIGN` mark sits in the gallery's upper-left corner at 12px, 16% opacity, with wide tracking.

**Why add this**:
- After the Ripple burst, viewers can lose their point of reference. A faint mark in the upper-left corner provides an anchor.
- It feels more refined than a large full-screen logo: strong brand signatures do not need to shout.
- When a GIF is captured or shared as a still, the ownership cue remains visible.

**Rules**: Show it only through the busy middle section. Hide it at the beginning so it does not cover the terminal, and at the end so the main brand reveal remains the protagonist.

---

## When not to use this composition

**❌ Feature demonstration**: the gallery moves too quickly for viewers to retain individual functions. Use one focused screen with tooltip annotations instead.

**❌ Data-driven content**: Audiences want to read numbers, and Gallery’s fast pace doesn’t give them time. Use "data chart + item-by-item reveal" instead.

**❌ Sequential storytelling**: Gallery is a parallel structure, while a story depends on cause and effect. Use Keynote-style chapter transitions instead.

**❌ Only three to five assets**: the ripple lacks density and feels improvised. Use a static arrangement with sequential highlights instead.

**❌ Vertical format (9:16)**: the 3D tilt needs horizontal room. In a vertical frame, it feels skewed rather than expansive.

---

## How to decide whether this composition fits

Three-step quick check:

**Step 1 · Asset count**: Count your similar visual assets. <15 → stop; 15–25 → add more; 25+ → proceed.

**Step 2 · Consistency test**: Place four random assets side by side. Do they look like a coherent set? If not, unify the style first or choose another composition.

**Step 3 · Narrative fit**: Are you trying to express breadth × depth (quantity × quality), or process, functionality, and story? If it is not the former, do not force this pattern.

If all three checks pass, fork the v6 HTML and replace the `SLIDE_FILES` array and timeline. Changing `--bg`, `--accent`, and `--ink` is enough to reskin the composition completely.

---

## Related references

- Complete technical process: [references/animations.md](animations.md) · [references/animation-best-practices.md](animation-best-practices.md)
- Animation export pipeline: [references/video-export.md](video-export.md)
- Audio configuration (BGM + SFX dual-track): [references/audio-design-rules.md](audio-design-rules.md)
- Apple Gallery-style horizontal reference: [references/apple-gallery-showcase.md](apple-gallery-showcase.md)
- Source HTML (v6 with integrated audio): `www.huasheng.ai/huashu-design-hero/index.html`
