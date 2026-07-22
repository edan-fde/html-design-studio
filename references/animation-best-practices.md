# Animation Best Practices · A Positive Grammar of Motion Design

> “Anthropic-quality” motion-design rules distilled from a deep analysis of three official Anthropic product animations: Claude Design, Claude Code Desktop, and Claude for Word.
>
> Use together with `animation-pitfalls.md`, the failure-prevention checklist. This document says **“do this”**; Pitfalls says **“do not do that.”** The two are complementary and both are required reading.
>
> **Scope:** this document covers only **motion logic and expressive style**. It does **not** introduce specific brand color values. Make color decisions through the §1.a Core Asset Protocol, extracting from the brand specification, or through Design-Direction Consultant Mode and the palettes associated with its twenty philosophies. This reference is about **how things move**, not **which colors they use**.

---

## §0 · Who You Are · Identity and Taste

> Read this section before any technical rule that follows. Rules **emerge from identity**, not the reverse.

### §0.1 Identity Anchor

**You are a motion designer who has studied the motion archives of Anthropic, Apple, Pentagram, and Field.io.**

When animating, you are not adjusting CSS transitions. You are using digital elements to **simulate a physical world**, convincing the viewer's subconscious that these objects have weight, inertia, elasticity, and the ability to overshoot.

You do not make PowerPoint-style animation. You do not make “fade in, fade out” animation. Your animation **makes the screen feel like a space the viewer could reach into**.

### §0.2 Three Core Beliefs

1. **Animation is physics, not a collection of animation curves.**
   `linear` is a number; `expoOut` is an object. Pixels on a screen deserve to be treated as physical things. Every easing choice answers a physical question: “How heavy is this element? What is its coefficient of friction?”

2. **Time allocation matters more than curve shape.**
   Slow–Fast–Boom–Stop is your breathing pattern. **Evenly paced animation is a technical demonstration; rhythmic animation is narrative.** Slowing down at the right moment matters more than choosing the correct easing at the wrong one.

3. **Giving the audience room is harder than showing off.**
   A 0.5-second pause before the key result is a **technique**, not a compromise. **Giving the human brain time to react is the animator's highest discipline.** AI defaults to unbroken, maximum-density motion with no pauses. That is novice work. Your job is restraint.

### §0.3 Standards of Taste · What Beauty Looks Like

These are your standards for distinguishing “good” from “great.” Each includes a **recognition test**. When reviewing a candidate animation, use these questions to judge it rather than mechanically comparing it with fourteen rules.

| Dimension of Beauty | Recognition Test: the Viewer's Reaction |
|---|---|
| **Physical weight** | When the motion ends, the element **lands** securely; it does not merely **stop**. The viewer subconsciously feels its weight. |
| **Room for the audience** | A perceptible pause of at least 300 ms precedes key information. The viewer has time to **see it** before motion continues. |
| **Negative space** | The ending is an abrupt stop + hold, not a fade to black. The final frame is clear, affirmative, and decisive. |
| **Restraint** | Exactly one moment receives 120% polish; the remaining 80% is precisely sufficient. **Showing off everywhere signals cheapness.** |
| **Tactility** | Arcs rather than straight lines; irregularity rather than `setInterval` rhythm; movement that breathes. |
| **Respect** | Show the tweaking process and the bug being fixed. **Do not hide the work or present “magic.”** AI is a collaborator, not a magician. |

### §0.4 Self-Check · The Audience's First-Reaction Test

After finishing an animation, ask: **what is the audience's first reaction when it ends?** This is the only metric to optimize.

| Audience Reaction | Rating | Diagnosis |
|---|---|---|
| “It looks pretty smooth.” | Good | Competent but generic; you are making PowerPoint. |
| “That animation flows really well.” | Good+ | Technically correct, but not remarkable. |
| “That really looks like it **floated up from the desktop**.” | Great | You achieved physical weight. |
| “This doesn't look AI-generated.” | Great+ | You reached Anthropic's threshold. |
| “I want to **take a screenshot** and share it.” | Great++ | You made the audience distribute the work voluntarily. |

The difference between great and good is not technical correctness; it is judgment and taste. Correct technique guided by sound taste is great. Correct technique without a point of view is merely good. Incorrect technique does not clear the baseline.

### §0.5 How Identity Relates to Rules

The technical rules in §1–§8 are **means of executing this identity** in concrete situations. They are not an independent checklist.

- When the rules do not cover a situation → return to §0 and judge from the **identity**; do not guess blindly.
- When rules conflict → return to §0 and use the **standards of taste** to decide which matters more.
- When you want to break a rule → first answer: “Which form of beauty in §0.3 does this serve?” If you have a clear answer, break it; otherwise do not.

Now continue.

---

## Overview · Animation as Physics at Three Levels

Most AI-generated animation feels cheap because **it behaves like numbers rather than objects**. Real objects have mass, inertia, elasticity, and overshoot. The sophistication of Anthropic's three videos comes from giving digital elements a **physical system of motion rules**.

The system has three levels:

1. **Narrative-rhythm layer:** time allocation through Slow–Fast–Boom–Stop.
2. **Motion-curve layer:** Expo Out, Overshoot, and Spring; reject linear.
3. **Expressive-language layer:** show the process, use arcing pointer paths, and resolve through a logo morph.

---

## 1. Narrative Rhythm · Five-Part Slow–Fast–Boom–Stop Structure

All three Anthropic videos follow this structure:

| Part | Share | Pace | Purpose |
|---|---|---|---|
| **S1 · Trigger** | ~15% | Slow | Give humans reaction time and establish realism. |
| **S2 · Generate** | ~15% | Medium | Introduce the visual surprise. |
| **S3 · Process** | ~40% | Fast | Demonstrate control, density, and detail. |
| **S4 · Burst** | ~20% | Boom | Pull the camera back, pop into 3D, or reveal multiple panels at once. |
| **S5 · Resolve** | ~10% | Still | Brand logo + abrupt stop. |

**Concrete timing for a 15-second animation:**
S1 Trigger 2 s · S2 Generate 2 s · S3 Process 6 s · S4 Burst 3 s · S5 Resolve 2 s

**Do not:**
- ❌ Use an even rhythm with identical information density every second; it exhausts the viewer.
- ❌ Maintain maximum density throughout; without a peak, nothing is remembered.
- ❌ End by fading away to transparency; **stop abruptly** instead.

**Self-check:** draw five thumbnails on paper, each representing the peak frame of one part. If the five images do not differ much, the rhythm is missing.

---

## 2. Easing Philosophy · Reject Linear Motion; Embrace Physics

Every effect in the three Anthropic videos uses a damped bezier curve. The standard cubic ease-out—`1-(1-t)³`—is **not sharp enough**: it does not launch quickly enough or settle firmly enough.

### Three Core Easings, Built into `animations.jsx`

```js
// 1. Expo Out · Launch quickly and brake gradually; the default primary easing
// CSS equivalent: cubic-bezier(0.16, 1, 0.3, 1)
Easing.expoOut(t) // = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)

// 2. Overshoot · Elastic toggles and button pops
// CSS equivalent: cubic-bezier(0.34, 1.56, 0.64, 1)
Easing.overshoot(t)

// 3. Physical Spring · Geometry settling naturally into place
Easing.spring(t)
```

### Usage Map

| Scenario | Easing |
|---|---|
| Card rise-in / panel entrance / terminal fade / focus overlay | **`expoOut`**, the primary and most common easing |
| Toggle switch / button pop / emphasized interaction | `overshoot` |
| Preview geometry settling / physical landing / UI bounce | `spring` |
| Continuous movement such as pointer-path interpolation | `easeInOut` to preserve symmetry |

### Counterintuitive Insight

Most product-film motion is **too fast and too rigid**. `linear` makes digital elements feel mechanical; `easeOut` is merely baseline competence. `expoOut` is the technical source of the “premium” feeling because it gives digital elements the **weight of physical objects**.

---

## 3. Motion Language · Eight Shared Principles

### 3.1 Never Use Pure Black or Pure White as the Main Background

None of the three Anthropic videos uses `#FFFFFF` or `#000000` as its main background. A temperature-tinted neutral—warm or cool—has the material quality of paper, canvas, or a desktop and reduces the mechanical feeling.

Choose exact color values through the §1.a Core Asset Protocol, extracting from the brand specification, or through Design-Direction Consultant Mode and its twenty background systems. This reference contains no values because color is a **brand decision**, not a motion rule.

### 3.2 Easing Is Never Linear

See §2.

### 3.3 Tell the Story Through Slow–Fast–Boom–Stop

See §1.

### 3.4 Show the Process, Not a Magical Result

- Claude Design shows parameter tweaks and slider dragging rather than one-click perfection.
- Claude Code shows a code error and the AI fixing it rather than succeeding immediately.
- Claude for Word shows the red deletions and green additions of the redlining process rather than presenting only the final draft.

**Shared subtext:** the product is a **collaborator, pair engineer, or senior editor**, not a one-click magician. This speaks directly to professional users' need for control and authenticity.

**Anti-AI-slop rule:** AI defaults to a “magical one-click success” animation—click once → perfect result—because that is the generic common denominator. **Do the reverse:** show the process, the tweak, the bug, and the fix. That becomes a source of brand identity.

### 3.5 Hand-Draw the Pointer Path with an Arc + Perlin Noise

Real pointer movement is not linear. It accelerates out of rest → follows an arc → decelerates and corrects → clicks. A pointer interpolated in a straight line by AI produces **subconscious aversion**.

```js
// Quadratic Bézier interpolation: start → control point → end
function bezierQuadratic(p0, p1, p2, t) {
  const x = (1-t)*(1-t)*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0];
  const y = (1-t)*(1-t)*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1];
  return [x, y];
}

// Path: start → offset midpoint → end, producing an arc
const path = [[100, 100], [targetX - 200, targetY + 80], [targetX, targetY]];

// Add extremely subtle Perlin noise, ±2 px, to simulate hand tremor
const jitterX = (simpleNoise(t * 10) - 0.5) * 4;
const jitterY = (simpleNoise(t * 10 + 100) - 0.5) * 4;
```

### 3.6 Resolve Through a Logo Morph

In all three Anthropic videos, the logo **does not simply fade in**. It **morphs from the preceding visual element**.

**Shared pattern:** during the final one or two seconds, morph, rotate, or converge so the entire narrative **collapses into the brand mark**.

**Low-cost implementation without a true morph:**
Collapse the preceding visual element into a color block—scale to 0.1 and translate toward center—then let the block expand into the wordmark. Use a 150 ms fast cut with motion blur, from `filter: blur(6px)` to `0`.

```js
<Sprite start={13} end={14}>
  {/* Collapse: scale previous element to 0.1; retain opacity; increase blur */}
  const scale = interpolate(t, [0, 0.5], [1, 0.1], Easing.expoOut);
  const blur = interpolate(t, [0, 0.5], [0, 6]);
</Sprite>
<Sprite start={13.5} end={15}>
  {/* Expand: logo grows from block center, scale 0.1 → 1 and blur 6 → 0 */}
  const scale = interpolate(t, [0, 0.6], [0.1, 1], Easing.overshoot);
  const blur = interpolate(t, [0, 0.6], [6, 0]);
</Sprite>
```

### 3.7 Pair Serif and Sans-Serif Roles

- **Brand / narration:** serif, supplying scholarship, editorial character, and taste.
- **UI / code / data:** sans-serif + monospace, supplying function.

**Relying on a single typeface is always the wrong choice here.** Serif supplies taste; sans-serif supplies function.

Choose actual faces through the Display / Body / Mono stacks in `brand-spec.md` or through the twenty philosophies in Design-Direction Consultant Mode. This reference contains no font recommendations because typography is a **brand decision**.

### 3.8 Focus Shift = Recede the Background + Sharpen the Foreground + Guide with a Flash

A focus shift does **more than** reduce opacity. The complete recipe:

```js
// Filter combination for out-of-focus elements
tile.style.filter = `
  brightness(${1 - 0.5 * focusIntensity})
  saturate(${1 - 0.3 * focusIntensity})
  blur(${focusIntensity * 4}px)        // ← Critical: blur creates actual recession
`;
tile.style.opacity = 0.4 + 0.6 * (1 - focusIntensity);

// When focus completes, guide the eye back with a 150 ms flash at the focal point
focusOverlay.animate([
  { background: 'rgba(255,255,255,0.3)' },
  { background: 'rgba(255,255,255,0)' }
], { duration: 150, easing: 'ease-out' });
```

**Why blur is mandatory:** opacity + brightness alone leaves non-focal elements sharp, so they do not visually recede. A 4–8 px blur pushes them into a genuinely deeper depth plane.

---

## 4. Concrete Motion Techniques: Copy-Ready Snippets

### 4.1 FLIP / Shared-Element Transition

A button **expands into** an input field; the button does not disappear while a new panel appears. The same DOM element transitions between two states rather than crossfading between two elements.

```jsx
// Framer Motion layoutId
<motion.div layoutId="design-button">Design</motion.div>
// ↓ After the click, use the same layoutId
<motion.div layoutId="design-button">
  <input placeholder="Describe your design..." />
</motion.div>
```

For a native implementation, see https://aerotwist.com/blog/flip-your-animations/

### 4.2 “Breathing” Expansion: Width, Then Height

A panel does **not** increase width and height simultaneously:
- First 40%: expand width only while height remains small.
- Final 60%: hold width and expand height.

This simulates the physical feeling of “unfold first, then fill with water.”

```js
const widthT = interpolate(t, [0, 0.4], [0, 1], Easing.expoOut);
const heightT = interpolate(t, [0.3, 1], [0, 1], Easing.expoOut);
style.width = `${widthT * targetW}px`;
style.height = `${heightT * targetH}px`;
```

### 4.3 Staggered Fade-Up with 30 ms Delays

When table rows, card columns, or list items enter, delay each element by **30 ms** while moving `translateY` from 10 px to 0.

```js
rows.forEach((row, i) => {
  const localT = Math.max(0, t - i * 0.03);  // 30 ms stagger
  row.style.opacity = interpolate(localT, [0, 0.3], [0, 1], Easing.expoOut);
  row.style.transform = `translateY(${
    interpolate(localT, [0, 0.3], [10, 0], Easing.expoOut)
  }px)`;
});
```

### 4.4 Nonlinear Breathing · Hold 0.5 Seconds Before a Key Result

Machines execute quickly and continuously, but **pause for 0.5 seconds before a key result** so the viewer's brain can react.

```jsx
// Typical sequence: AI finishes generating → hold 0.5 s → result appears
<Sprite start={8} end={8.5}>
  {/* 0.5 s pause: nothing moves; let the viewer watch the loading state */}
  <LoadingState />
</Sprite>
<Sprite start={8.5} end={10}>
  <ResultAppear />
</Sprite>
```

**Counterexample:** switching seamlessly to the result the instant generation ends. The viewer has no reaction time, so information is lost.

### 4.5 Chunk Reveal · Simulate Token Streaming

When AI generates text, **do not use `setInterval` to pop out one character at a time**, which resembles old film subtitles. Use a **chunk reveal**: expose two to five characters at once at irregular intervals, simulating real token streaming.

```js
// Split into chunks rather than individual characters
const chunks = text.split(/(\s+|,\s*|\.\s*|;\s*)/);  // Split by words and punctuation
let i = 0;
function reveal() {
  if (i >= chunks.length) return;
  element.textContent += chunks[i++];
  const delay = 40 + Math.random() * 80;  // Irregular 40–120 ms intervals
  setTimeout(reveal, delay);
}
reveal();
```

### 4.6 Anticipation → Action → Follow-Through

Three of Disney's twelve principles, all used explicitly by Anthropic:

- **Anticipation:** a small reverse movement before the action, such as a button shrinking slightly before it pops.
- **Action:** the primary movement itself.
- **Follow-through:** residual motion after the action, such as a slight bounce after a card lands.

```js
// Complete three-part card entrance
const anticip = interpolate(t, [0, 0.2], [1, 0.95], Easing.easeIn);        // Anticipation
const action  = interpolate(t, [0.2, 0.7], [0.95, 1.05], Easing.expoOut); // Action
const settle  = interpolate(t, [0.7, 1], [1.05, 1], Easing.spring);       // Follow-through
// Final scale = multiply the three values or apply them segment by segment
```

**Counterexample:** motion with Action but no Anticipation or Follow-through looks like PowerPoint animation.

### 4.7 Layer with 3D Perspective + `translateZ`

For an oblique 3D space with floating cards, give the container perspective and individual elements different `translateZ` values:

```css
.stage-wrap {
  perspective: 2400px;
  perspective-origin: 50% 30%;  /* Slightly elevated viewpoint */
}
.card-grid {
  transform-style: preserve-3d;
  transform: rotateX(8deg) rotateY(-4deg);  /* Golden ratio */
}
.card:nth-child(3n) { transform: translateZ(30px); }
.card:nth-child(5n) { transform: translateZ(-20px); }
.card:nth-child(7n) { transform: translateZ(60px); }
```

**Why `rotateX(8deg) / rotateY(-4deg)` is the sweet spot:**
- Above 10° → excessive distortion; elements appear to topple.
- Below 5° → reads as skew rather than perspective.
- The asymmetric 8° × −4° combination simulates a natural camera angle looking down from the upper-left of a desk.

### 4.8 Diagonal Pan · Move X and Y Together

Camera motion is not purely vertical or horizontal. **Move X and Y simultaneously** to simulate a diagonal track:

```js
const panX = Math.sin(flowT * 0.22) * 40;
const panY = Math.sin(flowT * 0.35) * 30;
stage.style.transform = `
  translate(-50%, -50%)
  rotateX(8deg) rotateY(-4deg)
  translate3d(${panX}px, ${panY}px, 0)
`;
```

**Critical:** use different frequencies for X and Y, such as 0.22 and 0.35, to prevent the Lissajous pattern from feeling regular and looped.

---

## 5. Scene Recipes: Three Narrative Templates

The three reference videos represent three different product characters. **Choose the one that best fits your product. Do not combine them.**

### Recipe A · Apple Keynote Drama, Like Claude Design

**Best for:** major releases, hero animation, visual surprise as the priority
**Rhythm:** a strong Slow–Fast–Boom–Stop arc
**Easing:** `expoOut` throughout, with limited `overshoot`
**SFX density:** high, approximately 0.4/s; tune SFX pitch to the BGM's scale
**BGM:** IDM / minimalist technological electronica; calm and precise
**Resolution:** rapid camera pullback → drop → logo morph → airy single note → abrupt stop

### Recipe B · Single-Take Tool Flow, Like Claude Code

**Best for:** developer tools, productivity apps, flow-state scenarios
**Rhythm:** continuous and stable, without an obvious peak
**Easing:** physical `spring` + `expoOut`
**SFX density:** **zero**; BGM alone drives the edit rhythm
**BGM:** lo-fi hip-hop / boom bap at 85–90 BPM
**Core technique:** align important UI actions to the transients of the BGM kick and snare—**the musical groove becomes the interaction sound**.

### Recipe C · Office-Productivity Narrative, Like Claude for Word

**Best for:** enterprise software, documents, spreadsheets, calendars, and work where professionalism leads
**Rhythm:** hard cuts between several scenes + dolly in/out
**Easing:** `overshoot` for toggles + `expoOut` for panels
**SFX density:** medium, approximately 0.3/s, led by UI clicks
**BGM:** jazzy instrumental in a minor key at 90–95 BPM
**Core highlight:** one scene must contain the **signature moment of the entire film**, such as a 3D pop-out that rises free of the flat plane.

---

## 6. Counterexamples · This Is AI Slop

| Antipattern | Why It Fails | Correct Approach |
|---|---|---|
| `transition: all 0.3s ease` | `ease` is a relative of linear; every element moves at the same speed | Use `expoOut` + per-element stagger |
| Every entrance uses only `opacity: 0 → 1` | No sense of motion direction | Add `translateY: 10 → 0` + Anticipation |
| Logo fades in | No narrative resolution | Morph, converge, or collapse-and-expand |
| Pointer moves in a straight line | Subconsciously mechanical | Bézier arc + Perlin noise |
| Typewriter reveals single characters with `setInterval` | Resembles old film subtitles | Chunk Reveal with irregular intervals |
| No hold before the key result | Viewers have no reaction time | Hold for 0.5 s before the result |
| Focus shift changes only opacity | Non-focal elements remain sharp | Opacity + brightness + **blur** |
| Pure black or pure white background | Cybernetic feel or glare fatigue | Temperature-tinted neutral from the brand specification |
| Every animation moves equally fast | No rhythm | Slow–Fast–Boom–Stop |
| Ending fades out | No decisiveness | Stop abruptly and hold the final frame |

---

## 6.5 · Visual-Density Requirements in the Director's Script: Lessons from B00, 2026-07-17

**A director's script containing only narrative and camera movement produces a wireframe.** The B00 step-sequence B-roll proved this. The v1 script fully described all six scenes, the timeline, and camera motion. The implementation agent delivered motion that met every requirement and passed every check—but visually it was a diagram made from “three plain dark blocks + large type.” The director rejected it outright as “too simple and too boring.” Without an explicit density standard, an agent always chooses the cheapest geometry that satisfies the brief.

**Every director's script or animation brief must explicitly include three things:**

1. **A visual-density standard:** specify the amount of detail required per screen—rows of structural UI content, legends, texture, and secondary elements—and include an executable acceptance statement such as: “Pause on any frame and it should hold its own beside the benchmark.”
2. **A concrete benchmark:** point to an existing finished piece, such as an earlier animation in the same project, the A series, or a named demo. Reuse its construction craft directly rather than asking the agent to invent from nothing.
3. **A global atmosphere-layer checklist:** grounding lines, soft component shadows, paper or background texture, a hero companion or similarly personified secondary element, and idle micro-motion in stationary components—breathing, cursor movement, or subtle forward creep. This layer, not the primary object itself, is the main remedy for an empty, boring feeling.

**The repair process is also standardized:** the motion skeleton—timeline, camera movement, morph paths, and title-card timing—and the visual craft—components, density, and atmosphere—are separate layers. When a review rejects the result, first determine which layer failed. If motion already passes, reskin it without rechoreographing.

---

## 7. Sixty-Second Pre-Delivery Checklist

- [ ] Does the narrative use Slow–Fast–Boom–Stop rather than even pacing?
- [ ] Is the default easing `expoOut`, not `easeOut` or `linear`?
- [ ] Do toggles and button pops use `overshoot`?
- [ ] Do card and list entrances have a 30 ms stagger?
- [ ] Is there a 0.5-second hold before the key result?
- [ ] Does typing use Chunk Reveal rather than single-character `setInterval`?
- [ ] Does each focus shift add blur rather than only opacity?
- [ ] Does the logo resolve through a morph instead of fading in?
- [ ] Is the background temperature-tinted rather than pure black or pure white?
- [ ] Does the typography establish serif and sans-serif roles?
- [ ] Does the ending stop abruptly rather than fading away?
- [ ] If a pointer appears, does it follow an arc rather than a straight line?
- [ ] Does SFX density fit the product character, per recipes A/B/C?
- [ ] Is there a 6–8 dB loudness difference between BGM and SFX? See `audio-design-rules.md`.

---

## 8. Relationship to Other References

| Reference | Purpose | Relationship |
|---|---|---|
| `animation-pitfalls.md` | Technical failure prevention, 16 rules | **“Do not do this”**; the inverse of this document |
| `animations.md` | Stage / Sprite engine usage | The foundation of **how to implement** animation |
| `audio-design-rules.md` | Two-layer audio rules | How to **add audio** to animation |
| `sfx-library.md` | Catalog of 37 SFX | The sound-effect **asset library** |
| `apple-gallery-showcase.md` | Apple gallery-display style | A focused guide to one particular motion style |
| **This document** | Positive motion-design grammar | **“Do this”** |

**Reading order:**
1. Begin with the five form-derivation questions in Step 3 of the `SKILL.md` workflow; they determine narrative role and visual temperature.
2. After selecting a direction, read this document to choose the **motion language**, including recipe A, B, or C.
3. While coding, consult `animations.md` and `animation-pitfalls.md`.
4. During video export, follow `audio-design-rules.md` + `sfx-library.md`.

---

## Appendix · Sources for This Document

- Analysis of official Anthropic animations: `参考动画/BEST-PRACTICES.md` (`reference-animation/BEST-PRACTICES.md`; the code-formatted path preserves the original folder name) in the original project directory.
- Anthropic audio analysis: `AUDIO-BEST-PRACTICES.md` in the same directory.
- Three reference videos: `ref-{1,2,3}.mp4` with the corresponding `gemini-ref-*.md` and `audio-ref-*.md` files.
- **Strict filtering:** this reference contains no specific brand color values, font names, or product names.
  Make color and typography decisions through the §1.a Core Asset Protocol or the twenty design philosophies.
