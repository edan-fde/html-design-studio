# GSAP Recipes · Translating Design Language into GSAP Timelines

> This file has one purpose: translate html-design-studio's established animation language—the five-part narrative, easing system, eight motion principles, and scene recipes in `animation-best-practices.md`, plus the 22-second, five-scene template in `cinematic-patterns.md`—into paste-ready GSAP timeline recipes for the HyperFrames backend.
>
> **The skill's own references remain the authority on design judgment; GSAP is only the implementation tool.**
> For when to hold, which narrative arc to use, and what visual quality means, read `animation-best-practices.md` §0. This document answers only: “How do I express that rule in GSAP?”
> For the HyperFrames composition contract—root attributes, `.clip` markers, render commands, and checks—see `references/hyperframes-backend.md`. This document references that contract without repeating it.

---

## 0 · Base template (every composition starts here)

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script>
  window.__timelines = window.__timelines || {};

  const tl = gsap.timeline({
    paused: true,                                   // Required: HyperFrames controls seeking.
    defaults: { ease: "expo.out", duration: 0.6 },  // This skill's primary easing; see §1.
  });

  // ...attach every tween to this timeline...

  window.__timelines["main"] = tl;  // The key must match data-composition-id.
</script>
```

Hard constraints for the composition root; violating any one makes rendering nondeterministic:

- The timeline must use `paused: true`; **never call `tl.play()`** for rendered animation
- Build the timeline synchronously, never inside an async function, timer, or event callback
- Render duration comes from the composition root's `data-duration`, not timeline length. Do not pad duration with empty tweens
- Never use `repeat: -1`. Derive a finite repeat count from the visible duration
- Note: `defaults: { ease: "expo.out" }` is different from
  the `power3.out` house default in the HyperFrames animation documentation. That is HyperFrames' convention; this skill's established rule is that `expoOut` is the primary default. This translation layer follows the skill's own design language.

---

## 1 · Easing map · Custom easing → GSAP

Each custom easing function in `assets/animations.jsx` maps to a GSAP expression below. The first three are mathematically **identical curves**, not approximations.

| Custom easing | Mathematical definition | GSAP expression | Relationship | Established use |
|---|---|---|---|---|
| `expoOut` | `1 - 2^(-10t)` | `"expo.out"` | Identical | **Primary default**: card rise-ins, panel entrances, terminal fades, focus overlays |
| `overshoot` | easeOutBack, c1=1.70158 | `"back.out"` (default 1.70158) or `"back.out(1.7)"` | Identical | Toggle state changes, button pops, emphasized interactions |
| `spring` | easeOutElastic, period 2π/3 | `"elastic.out(1, 0.3)"` (default `"elastic.out"`) | Identical | Geometry settling, physical placement, UI recoil |
| `easeIn` | `t²` | `"power1.in"` | Identical | Exits and anticipation wind-ups |
| `easeOut` | `1-(1-t)²` | `"power1.out"` | Identical | Subtle secondary motion, such as fading annotations |
| `easeInOut` | quad inOut | `"power1.inOut"` | Identical | Continuous symmetric motion, such as cursor-path interpolation |
| `linear` | `t` | `"none"` | Identical | Proxy drivers and intentionally constant-speed camera motion only. **Never use it for ordinary element animation.** |
| `anticipation` | Piecewise curve that first dips to -0.3, then rises | No built-in equivalent; use a function ease (see below) | Custom function | Entrance with a preparatory motion |

### 1.1 anticipation · Function ease

GSAP accepts any `(p) => number` function as an ease, so reuse the custom definition directly:

```js
// Point-for-point equivalent to Easing.anticipation in animations.jsx.
const anticipation = (t) => {
  if (t < 0.2) return -0.3 * (t / 0.2) * (t / 0.2);   // First 20%: dip in the opposite direction.
  const a = (t - 0.2) / 0.8;
  return -0.012 + 1.012 * a * a * (3 - 2 * a);         // Remaining 80%: rebound with smoothstep.
};

tl.fromTo("#card", { y: 40 }, { y: 0, duration: 0.7, ease: anticipation }, "s2");
```

Because this curve crosses below zero, **use it only for transforms** such as `y`, `scale`, and `rotation`. Do not apply it to opacity or color, where it would exceed the valid range.

### 1.2 Another spring option · Baked spring (seek-safe physical response)

`"elastic.out(1, 0.3)"` exactly matches the custom spring and is safe to use directly. When you need a physically plausible spring with **adjustable damping**—for example, almost no overshoot but a long settling tail—use HyperFrames animation's closed-form `springEase`. `adapters/gsap-easing-and-stagger.md` contains the full 40-line implementation. Because the closed form is a pure function of time, it remains seek-safe:

```js
// dampingFraction 1.0 = stable settling with no overshoot; 0.6–0.7 ≈ the custom spring's bounce.
const settle = springEase({ response: 0.4, dampingFraction: 0.65 });
tl.fromTo("#hero", { scale: 0 }, { scale: 1,
  duration: settle.duration, ease: settle.ease }, "s4");   // Keep this duration: it is part of the physical response.
```

**Do not** introduce a real-time spring integrator such as react-spring. Its state accumulates frame by frame, making deterministic seeking impossible.

---

## 2 · Five-part narrative skeleton · Slow–Fast–Boom–Stop (15/15/40/20/10%)

Why: uniformly paced animation feels like a technical demo; rhythmic animation creates a narrative (`animation-best-practices.md` §1).

Timeline skeleton with labels; change `D` to support any total duration:

```js
const D = 15;   // Total duration in seconds; must match the composition root's data-duration.
const at = (p) => D * p;

const tl = gsap.timeline({
  paused: true,
  defaults: { ease: "expo.out", duration: 0.6 },
});

// ── Five labels at 15 / 15 / 40 / 20 / 10 percent. ───────────────────────────
tl.addLabel("s1_trigger",  at(0));     // Slow · Trigger: allow human reaction time and establish realism.
tl.addLabel("s2_generate", at(0.15));  // Medium · Generate: deliver one clear moment of visual surprise.
tl.addLabel("s3_process",  at(0.30));  // Fast · Process: show control, density, and detail.
tl.addLabel("s4_boom",     at(0.70));  // Boom · Burst: pull back, pop into 3D, reveal multiple panels.
tl.addLabel("s5_hold",     at(0.90));  // Still · Resolve: logo morph, then an abrupt stop.

// ── S1 Trigger (slow: one action with generous negative space). ──────────────
tl.fromTo("#terminal", { y: 48, autoAlpha: 0 },
  { y: 0, autoAlpha: 1, duration: 0.8 }, "s1_trigger+=0.1");

// ── S2 Generate (one clear surprise; do not stack actions). ──────────────────
tl.fromTo("#result-panel", { scale: 0.92, autoAlpha: 0 },
  { scale: 1, autoAlpha: 1, duration: 0.7 }, "s2_generate");

// ── S3 Process (highest density: stagger, typewriter, and focus shifts). ─────
tl.fromTo(".row", { y: 10, autoAlpha: 0 },
  { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.03 }, "s3_process");

// ── S4 Boom (camera-level movement: pull-back, rotationX, panel burst). ───────
tl.to("#stage", { scale: 0.82, rotationX: 8, duration: 1.2,
  ease: "expo.inOut" }, "s4_boom");

// ── S5 Resolve (logo morph; see §3.6). Nothing moves afterward. ──────────────
// The final ~0.5s is an intentional hold: no tween and no fade to black.

window.__timelines["main"] = tl;
```

Key points:

- **Hold after S5**: `data-duration` extends beyond the final tween, so the last frame remains on screen. This implements the decisive stop; do not fade to black.
- The 22-second five-scene template from `cinematic-patterns.md` Pattern B uses the same label structure with different durations: Invoke 3–4s / Process 5–6s / Insight 4–5s / Output 3–4s / Hero 4–5s.
- Full-screen scene changes use overlapping `autoAlpha` and displacement. Do not toggle `display` or bare `visibility`; the renderer expects `autoAlpha` for show/hide transitions.

---

## 3 · Eight motion-language principles in GSAP

### 3.1 Avoid pure black and pure white backgrounds

This is primarily a static-CSS rule: choose a temperature-tinted neutral that follows the brand palette. When a scene transition changes the background, tween `backgroundColor`—an allowed property—and keep both colors within the same family, as required by `cinematic-patterns.md` §2:

```js
tl.to("#stage", { backgroundColor: "#F4EFE6", duration: 0.8, ease: "sine.inOut" }, "s4_boom");
```

### 3.2 Easing must never default to linear

Why: `linear` makes digital elements feel like machines, `expoOut` gives physical weight (best-practices §2).

Implementation: set `ease: "expo.out"` in timeline `defaults` (see §0), then override individual tweens using the §1 map. `ease: "none"` is allowed only for proxy-driver tweens (§7) and intentionally mechanical motion such as a constant-speed camera pan.

### 3.3 Slow-Fast-Boom-Stop

See §2 skeleton, not repeated.

### 3.4 Show the process, not a magical result

Why: the product is a collaborator, not a magician. Show tweaks, error correction, and redlines to counter the “one-click magic” pattern of AI slop (`animation-best-practices.md` §3.4).

The two most commonly used "process sense" recipes:

**Chunk reveal (simulated token streaming).** The original recipe uses `setTimeout` and `Math.random`, both invalid under seek rendering. Replace them with a precomputed schedule plus a proxy driver so seeking works in both directions:

```js
// Do not use tl.call(): callbacks are not reversible and leave stale state when scrubbing backward.
const rand = mulberry32(42);                              // Seeded randomness; see §6.4.
const text = "Three candidates are ready. The first is the most radical; the second is safer.";
const chunks = text.split(/(?=[,.;!?])|(?<=[,.;!?])/); // Split at punctuation boundaries.
const times = []; let acc = 0;
chunks.forEach(() => { acc += 0.04 + rand() * 0.08; times.push(acc); }); // Irregular 40–120ms cadence.

const tw = { t: 0 };
tl.to(tw, {
  t: acc, duration: acc, ease: "none",
  onUpdate: () => {   // Recompute all visible text from t each frame: pure and reversible.
    let n = 0;
    while (n < times.length && times[n] <= tw.t) n++;
    document.querySelector("#stream").textContent = chunks.slice(0, n).join("");
  },
}, "s2_generate+=0.3");
```

**Number counter (shows real data rising)**:

```js
// snap guarantees an integer; innerText is HyperFrames' supported counter pattern.
tl.fromTo("#metric", { innerText: 0 },
  { innerText: 237, snap: { innerText: 1 }, duration: 1.2, ease: "expo.out" }, "s3_process");
```

For thousands separators or suffixes, animate a proxy value and format it in `onUpdate` with `toLocaleString`; the pattern is otherwise identical.

### 3.5 Cursor path · Arc plus hand jitter

Why: a linearly interpolated cursor feels mechanically perfect. Human movement accelerates, follows an arc, then decelerates and corrects (`animation-best-practices.md` §3.5).

A proxy drives the Bézier arc because a standard property tween cannot express it. Do not use Perlin noise for jitter because the original runtime noise is nondeterministic. Two sinusoids with incommensurate frequencies create a deterministic equivalent:

```js
const mouse = { p: 0 };
const P0 = [100, 100];                       // starting point
const P2 = [tx, ty];                          // end point (click target)
const P1 = [tx - 200, ty + 80];               // Control point offset from the midpoint to create an arc.

tl.to(mouse, {
  p: 1, duration: 1.1, ease: "power1.inOut",  // Symmetric easing: accelerate away, decelerate on arrival.
  onUpdate: () => {
    const t = mouse.p;
    let x = (1-t)*(1-t)*P0[0] + 2*(1-t)*t*P1[0] + t*t*P2[0];
    let y = (1-t)*(1-t)*P0[1] + 2*(1-t)*t*P1[1] + t*t*P2[1];
    x += Math.sin(t * 47.13) * 2 * (1 - t);   // ±2px hand jitter that converges near the target.
    y += Math.sin(t * 33.7 + 1.3) * 2 * (1 - t);
    gsap.set("#cursor", { x, y });            // Everything derives from p, so it is seek-safe.
  },
}, "s1_trigger+=0.5");

// Click feedback: anticipation squash, then rebound.
tl.to("#cursor", { scale: 0.85, duration: 0.08, ease: "power1.in" }, ">");
tl.to("#cursor", { scale: 1, duration: 0.25, ease: "back.out" }, ">");
```

### 3.6 Logo morph and resolution

Why: fading in a logo provides no narrative closure. Collapse the previous visual into a compact form, then expand that form into the logo so the story resolves at the brand (`animation-best-practices.md` §3.6).

Animate blur through CSS variables. `filter` is paint-only and seek-safe, and this is the approved depth-of-field pattern:

```css
#lastVisual, #logo { --blur: 0px; filter: blur(var(--blur)); will-change: filter; }
```

```js
tl.addLabel("morph", "s5_hold-=0.3");

// Collapse: shrink the previous visual into a color block as motion blur rises.
tl.to("#lastVisual", { scale: 0.1, "--blur": "6px",
  duration: 0.5, ease: "expo.out" }, "morph");

// Expand: pop the logo from the color block's center while blur resolves to sharpness.
tl.fromTo("#logo",
  { scale: 0.1, "--blur": "6px", autoAlpha: 0 },
  { scale: 1, "--blur": "0px", autoAlpha: 1, duration: 0.6, ease: "back.out" },
  "morph+=0.35");                              // ~150ms overlap creates a fast match cut.

tl.to("#lastVisual", { autoAlpha: 0, duration: 0.15 }, "morph+=0.5");
// Hold: no further tweens; stop decisively.
```

### 3.7 Pair serif and sans-serif type

This is a static CSS rule, not a timeline concern. Choose fonts according to the brand specification. The HyperFrames compiler fetches Google Fonts and injects deterministic `@font-face` declarations, avoiding the font-timing failures measured in the legacy pipeline. Reference Google Fonts normally in CSS.

### 3.8 Focus shift = background recession + foreground sharpness + flash cue

Why: reducing opacity alone leaves unfocused elements visually sharp. Add blur so they genuinely recede (`animation-best-practices.md` §3.8).

The three-piece filter set all uses CSS variables, and the GSAP tween variable itself:

```css
.tile {
  --f: 0;   /* focusIntensity 0→1 */
  filter: brightness(calc(1 - 0.5 * var(--f)))
          saturate(calc(1 - 0.3 * var(--f)))
          blur(calc(var(--f) * 4px));          /* Key: blur makes unfocused elements recede. */
  will-change: filter;
}
```

```js
tl.addLabel("focus", "s3_process+=1.5");

// Unfocused elements: animate all three filters plus opacity in one tween.
tl.to(".tile:not(.focus-target)", {
  "--f": 1, opacity: 0.4, duration: 0.5, ease: "expo.out",
}, "focus");

// Flash highlight guides the eye back.
// The original used element.animate() (WAAPI), which runs on wall-clock time and is nondeterministic under seeking.
tl.fromTo("#focusFlash",
  { backgroundColor: "rgba(255,255,255,0.3)" },
  { backgroundColor: "rgba(255,255,255,0)", duration: 0.15, ease: "power1.out" },
  "focus+=0.5");

// Focus release: restore full sharpness before handing off to the next scene.
// A half-blurred resting state reads as a rendering bug.
tl.to(".tile", { "--f": 0, opacity: 1, duration: 0.5, ease: "power2.inOut" }, "focus+=2.5");
```

Performance constraints from the official depth-of-field rule: keep blur ≤24px on large elements. Prefer dimming plus moderate blur over blur alone, and add `will-change: filter` only to elements whose blur actually animates.

---

## 4 · Specific motion techniques · GSAP versions of the §4 recipes

### 4.1 FLIP / Shared Element (button expands into input box)

Why: one element should transition between two states rather than cross-fading two separate elements (`animation-best-practices.md` §4.1). The original recipe uses Framer Motion's `layoutId`. Do not add GSAP's Flip plugin here because it has not been validated under HyperFrames. Instead, calculate the transform explicitly: the composition viewport is fixed by `data-width`/`data-height`, and both state geometries are design constants. Use `fromTo`; encode displacement and scale entirely as transforms while leaving the element laid out at its final position:

```css
/* Lay out the final state statically; express the initial state through transforms. */
#search-box { width: 560px; height: 56px; }   /* Static final geometry; never tween these dimensions. */
```

```js
// Initial button: 120×44 at (400, 300). Final input: 560×56 at (200, 300).
tl.fromTo("#search-box",
  { x: 200, y: 0, scaleX: 120/560, scaleY: 44/56, transformOrigin: "left top" },
  { x: 0,   y: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: "expo.out" },
  "s2_generate");
// Delay the inner text so scaleX never visibly stretches it; same principle as §4.2.
tl.fromTo("#search-box .placeholder", { autoAlpha: 0 },
  { autoAlpha: 1, duration: 0.3 }, "s2_generate+=0.4");
```

### 4.2 Breathing expansion (open the shell, then fill it)

Why: the panel should not expand in both dimensions at once. Open it horizontally first, then lift it vertically to suggest physical construction (`animation-best-practices.md` §4.2).

The original tweens `width` and `height`, which trigger reflow and are restricted in HyperFrames. Integer pixel snapping creates visible jitter during slow tails; see §6.2. Translate the motion to `scaleX` and `scaleY` while preserving the timing offsets:

```js
// L is total expansion time. Stretch horizontally for the first 40%; begin vertical growth at 30%, creating overlap.
const L = 0.9;
tl.fromTo("#panel",
  { scaleX: 0, scaleY: 0.12, transformOrigin: "left top" },
  { scaleX: 1, duration: 0.4 * L, ease: "expo.out" }, "open");
tl.to("#panel", { scaleY: 1, duration: 0.7 * L, ease: "expo.out" }, "open+=" + 0.3 * L);

// Reveal content only after the shell has opened: first build the container, then fill it.
// This also hides any content distortion during scaling.
tl.fromTo("#panel .content", { autoAlpha: 0, y: 8 },
  { autoAlpha: 1, y: 0, duration: 0.35 }, "open+=" + 0.75 * L);
```

The scale version is not pixel-faithful: borders and corner radii deform with the transform. This is usually invisible on a solid panel with generous corners. If border detail matters, keep the shell fixed and reveal the content with `clip-path`, then verify with frame captures.

### 4.3 Staggered fade-up (30ms stagger)

Why: a list that appears item by item feels physically assembled rather than dropped in as one block. The established interval is 30ms (`animation-best-practices.md` §4.3).

```js
tl.fromTo(".row",
  { y: 10, autoAlpha: 0 },
  { y: 0, autoAlpha: 1, duration: 0.4, ease: "expo.out", stagger: 0.03 },
  "s3_process");

// Variant: emerge from the center outward, common for S4 multi-panel bursts.
tl.fromTo(".panel",
  { y: 24, autoAlpha: 0, scale: 0.96 },
  { y: 0, autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out",
    stagger: { each: 0.03, from: "center" } },
  "s4_boom");
```

Use `fromTo`, not `from`. Subcompositions are repeatedly re-sought; `from` snapshots initial state at registration and can misalign after scrubbing backward. `fromTo` declares both endpoints explicitly and remains consistent.

### 4.4 Hold for 0.5s before a key result

Why: machine execution is fast and continuous, but the human brain needs reaction time. A 0.5-second pause before a key result is a courtesy to the audience (`animation-best-practices.md` §4.4 and §0.2, Core Belief 3).

A hold in GSAP is simply a gap between position parameters. Use labels to encode it as an explicit design decision:

```js
// The moment generation completes.
tl.addLabel("generated", "s2_generate+=1.2");
// Hold the loading state for 0.5s with no tween so the audience can register it.
tl.addLabel("reveal", "generated+=0.5");

tl.fromTo("#result", { scale: 0.94, autoAlpha: 0 },
  { scale: 1, autoAlpha: 1, duration: 0.7, ease: "expo.out" }, "reveal");
```

### 4.5 Anticipation → Action → Follow-through

Why: animation containing only the main action feels like PowerPoint. Disney's three-phase pattern gives movement life (`animation-best-practices.md` §4.6).

Sequence three tweens using the §1 mapping: `power1.in` for anticipation, `expo.out` for action, and elastic easing for follow-through:

```js
tl.addLabel("pop", "s2_generate+=0.2");
tl.to("#card", { scale: 0.95, duration: 0.12, ease: "power1.in"  }, "pop");        // Preparatory
tl.to("#card", { scale: 1.05, duration: 0.30, ease: "expo.out"   }, ">");          // active
tl.to("#card", { scale: 1.00, duration: 0.35, ease: "elastic.out(1, 0.3)" }, ">"); // rebound
```

Single-tween alternative: `ease: anticipation` (§1.1) combines the wind-up and primary action; add a separate rebound tween for follow-through.

### 4.6 3D Perspective + translateZ layering

Why: `rotationX: 8` and `rotationY: -4` simulate a camera looking slightly downward toward the desktop's upper-left area (`animation-best-practices.md` §4.7).

Perspective and depth layering remain static CSS; `perspective` and `translateZ` do not need animation. Animate only the entrance and S4 pullback with GSAP's 3D transform properties:

```css
.stage-wrap { perspective: 2400px; perspective-origin: 50% 30%; }
.card-grid  { transform-style: preserve-3d; }
.card:nth-child(3n) { transform: translateZ(30px); }
.card:nth-child(5n) { transform: translateZ(-20px); }
.card:nth-child(7n) { transform: translateZ(60px); }
```

```js
// Entry: slowly standing from front to golden angle
tl.fromTo("#card-grid", { rotationX: 0, rotationY: 0 },
  { rotationX: 8, rotationY: -4, duration: 1.4, ease: "expo.out" }, "s2_generate");
```

### 4.7 Diagonal pan · Move X and Y at different frequencies

Why: different X and Y frequencies prevent an obvious Lissajous loop and suggest the diagonal drift of a handheld camera (`animation-best-practices.md` §4.8).

The original recipe evaluates `Math.sin(flowT * ...)` frame by frame. In GSAP, superimpose two finite yoyo tweens with different durations. GSAP tracks `x` and `y` independently, so the tweens do not conflict:

```js
// Different periods (4.6s vs 2.9s) create different frequencies, so the path does not close.
// Derive finite repeat counts from visible duration; Math.ceil(D / dur) covers the full film.
tl.to("#stage", { x: 40, duration: 4.6, ease: "sine.inOut",
  yoyo: true, repeat: Math.ceil(D / 4.6) }, 0);
tl.to("#stage", { y: 30, duration: 2.9, ease: "sine.inOut",
  yoyo: true, repeat: Math.ceil(D / 2.9) }, 0);
```

### 4.8 End abruptly

Why: There is no sense of decision in fade out, and the last frame must be clear and definite (best-practices §0.3 Leave blank).

This requires no visual tween: after the S5 logo settles, add nothing else to the timeline. Set `data-duration` 0.5–1 second beyond the last tween so the final state holds.
If there is BGM, use volume tween to close the sound at the end (volume is in the allowed list):

```js
tl.to("#bgm", { volume: 0, duration: 0.4 }, "s5_hold+=0.8");  // Audio cuts while the image remains still.
```

---

## 5 · Scene recipe A/B/C · Timeline structure points

For design judgment—recipe choice, SFX density, and BGM style—see `animation-best-practices.md` §5. This section covers timeline differences only.

### Formula A · Apple Keynote dramatic style

- Skeleton: use the full five-part structure from §2, including the S4 boom.
- Defaults: `ease: "expo.out"`; use `"back.out"` for emphasized interactions.
- S4 logo action: camera zooms out + drop. `tl.to("#stage", { scale: 0.78, y: -40, duration: 1.1, ease: "expo.inOut" }, "s4_boom")`
- S5: Logo Morph (§3.6) + ethereal single tone + hold

### Recipe B · Continuous single-take product flow

- Structure: **do not force** the five-part climax. Use one continuous flow, with labels aligned to BGM measures:
  `tl.addLabel("bar1", 0); tl.addLabel("bar2", 60/88*4);` (88 BPM, one measure ≈ 2.73s)
- Place key UI actions directly on kick or snare beats so the music supplies the interaction rhythm.
- Easing: `springEase` (§1.2) + `"expo.out"`, more settled than explosive.
- No S4-style boom; end abruptly.

### Recipe C · Workplace-efficiency narrative

- Structure: brisk cuts across multiple scenes. Give every scene a label and switch with a fast 0.15s `autoAlpha` transition
  instead of long overlap; with Dolly In/Out:
  `tl.fromTo("#scene2", { scale: 1.06 }, { scale: 1, duration: 1.2, ease: "expo.out" }, "sc2")`
- Use `"back.out"` for toggle interactions and `"expo.out"` for panels.
- Give the film one 3D pop-out highlight using the `rotationX` and `translateZ` pattern from §4.6. Use it once; repeating the flourish in every scene destroys its value.

---

## 6 · Seek-safety rules (all validated in Phase 0)

HyperFrames renders by seeking and capturing one frame at a time. Any state that is not a pure function of time becomes nondeterministic. Such defects often remain invisible in preview and appear only in the rendered output.

### 6.1 Ban CSS transitions triggered by class changes · Express state changes as tweens

CSS transitions run on the browser's wall clock, not the GSAP timeline. Under frame-by-frame seeking, every frame is a direct state mutation; the transition either never fires or starts from the wrong state. This failed in hands-on testing during the Phase 0 migration of c3.

```css
/* ✗ Old: JS calls classList.add('lit') and relies on a CSS transition. */
.capsule { transition: transform 0.3s ease; }
.capsule.lit { transform: scale(1.06); }
```

```js
// ✓ New: encode the state change itself as timeline tweens.
tl.to("#capsule", { scale: 1.06, duration: 0.3, ease: "expo.out" }, "lit_at");
tl.to("#capsule", { scale: 1.0,  duration: 0.3, ease: "expo.out" }, "lit_at+=1.2");
```

The same restriction applies to `element.animate()` (WAAPI uses the same wall clock; §3.8 translates its flash effect) and CSS `@keyframes` used for render-critical animation. Before delivery, run `grep -n "transition:\|animation:\|\.animate(" index.html`; remove every hit or translate it into timeline tweens.

### 6.2 Do not animate reflow-triggering properties · Use transforms

Layout properties snap to integer device pixels during layout. Fast tweens may hide this, but a slow ease-out tail that moves less than one pixel per frame will hold for several frames and then jump by one pixel, creating visible jitter. Phase 0 lint caught this exact silent defect in animated `letterSpacing`.

| ✗ Forbidden tween | ✓ Faithful replacement |
|---|---|
| `width` / `height` | `scaleX` / `scaleY` + `transformOrigin`; see content handling in §4.2 |
| `top` / `left` / `right` / `bottom` | The element stops at the CSS final position, tween `x` / `y` offset |
| `fontSize` | `scale` (visual equivalent, sub-pixel smoothing) |
| `letterSpacing` / `wordSpacing` | verbatim split followed by tween `x` for each character (uniform scale is not the same effect, it scales glyphs rather than kerning) |
| `margin*` / `padding*` | Fix the layout statically and animate `x` / `y` |

Repair principle: **reproduce the same visual result and remove only the jitter**. Passing lint is not sufficient; compare the migration frame by frame with the original.

### 6.3 `onUpdate` may not fire at t=0 · Render the first frame explicitly

When the timeline seeks to zero, a proxy tween's `onUpdate` may not fire, leaving the first frame in its initial DOM state. For every proxy-driven pattern—the §3.4 chunk reveal, §3.5 cursor path, and §7 legacy adapter—render the initial state once after registering the timeline:

```js
window.__timelines["main"] = tl;
render(0);   // First-frame safeguard: render t=0 explicitly.
```

### 6.4 Ban `Math.random` and wall-clock time · Use seeded randomness

Seeking to the same time must always produce the same frame. Runtime randomness produces a different result on every render and therefore breaks frame-by-frame capture. When particles, jitter, or irregular intervals need controlled variation, use `mulberry32` **before creating the timeline** and precompute every random value. This pattern was validated in the Phase 0 3D-particle demo:

```js
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260717);   // Keep the seed fixed; change it only to create a deliberate new random variant.

// Precompute values; never draw fresh randomness inside onUpdate.
const offsets = Array.from({ length: 40 }, () => (rand() - 0.5) * 24);
```

Also prohibit `Date.now()`, `performance.now()`, and event-driven state; rendering mode has no input events.

---

## 7 · Legacy-demo adapter · Attach `render(t)` to GSAP

All 21 legacy demos from the custom engine are built around pure `render(t)` functions. Migration does not rewrite their animation logic. A proxy tween attaches `render(t)` to the GSAP timeline. Phase 0 validation took 20–30 minutes per demo without changing a line of animation logic, including the 1,134-line cinematic c3 demo.

### 7.1 Proxy-tween template (12 lines, validated on c3)

```js
// =============== HyperFrames adapter ===============
// Proxy tween drives the original render(t). Every frame is a pure function of timeline time:
// no rAF, no clock, and no input state.
window.__timelines = window.__timelines || {};
const proxy = { t: 0 };
const tl = gsap.timeline({ paused: true });
tl.to(proxy, {
  t: T.DURATION,            // Legacy demo's total-duration constant.
  duration: T.DURATION,
  ease: "none",             // Map time uniformly; render(t) contains the animation easing.
  onUpdate: () => render(proxy.t),
}, 0);
window.__timelines["main"] = tl;

// First-frame safeguard: onUpdate does not fire while the timeline is parked at t=0; see §6.3.
render(0);
```

### 7.2 Four steps of migration

1. **Wrap the root and clip**: add composition-root attributes to the outermost container (`data-composition-id="main"`, `data-duration`, and dimensions). Add `.clip`, `data-start`, `data-duration`, and `data-track-index` to the stage. See `hyperframes-backend.md` for the full contract
2. **Remove self-driven playback**: delete the rAF loop, `setInterval`, autoplay logic, and `performance.now()` origin. `render(t)` must accept time only as its argument and never obtain time itself
3. **Attach the proxy**: paste the §7.1 template, match `T.DURATION` to `data-duration`, and finish with `render(0)`
4. **Audit nondeterminism**: run `grep -n "transition:\|animation:\|\.animate(\|Math.random\|Date.now\|performance.now"` and eliminate every hit. Convert class-driven effects into pure functions of `t` as described in §6.1; `classList.add + transition` is the most common legacy residue

After migration, run `npx hyperframes check`. Use `--no-contrast` for dark cinematic work, but require zero errors from the other four checks. Then capture three or four key moments and compare them with the legacy version.

### 7.3 When not to use the adapter

The adapter is for **migrating existing work**. New animation should use the native timeline patterns in §0–§5: labels are readable, staggers are declarative, and GSAP Inspector can inspect every tween. A proxy-driven animation is an opaque black box to audit tools.

---

## 8 · Pre-delivery self-check (GSAP side, supplement best-practices §7 list)

- [ ] Is the timeline `paused: true`, with a registration key matching `data-composition-id`?
- [ ] Is `expo.out` the default, with no bare `linear` or generic `ease` on element animation?
- [ ] Are all five segment labels present, with an untweened hold after S5 and no fade-out?
- [ ] Does `grep "transition:\|\.animate(\|Math.random\|Date.now"` return zero hits?
- [ ] Are `width`, `height`, `top`, `left`, `letterSpacing`, and `fontSize` absent from tweens?
- [ ] Is every `repeat` finite?
- [ ] Does every proxy-driven composition end with `render(0)`?
- [ ] Do blur/filter animations use CSS variables, with `will-change: filter` only on elements whose blur moves?
- [ ] Do subcomposition entrances use `fromTo` rather than `from`?
- [ ] Does `npx hyperframes check` pass (`--no-contrast` for dark cinematic work; zero errors from all other checks)?
