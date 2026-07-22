# Cinematic Patterns · Best Practices for Workflow Demos

> Five patterns that elevate “PowerPoint animation” into launch-event-quality cinematics.
> Distilled from two cinematic demos in the April 2026 “Let’s Talk About Skills” deck—the Nuwa and Darwin workflows—and verified in practice.

---

## 0 · The Problem This Document Solves

When demonstrating a workflow through animation—common cases include a skill workflow, product onboarding, an API call sequence, or agent task execution—there are two common approaches:

| Paradigm | What It Looks Like | Result |
|---|---|---|
| **PowerPoint animation** (poor) | Step 1 fades in → step 2 fades in → step 3 fades in; four boxes remain arranged on screen | The audience thinks, “This is just PowerPoint with fades.” There is no wow moment. |
| **Cinematic** (good) | Scene-based; only one subject is in focus at a time; scenes connect through dissolves, focus pulls, or morphs | The audience feels they are watching part of a product launch and wants to capture and share it. |

The difference comes **not from animation technology**, but from the **narrative paradigm**. This document explains how to move from the first to the second.

---

## 1 · Five Core Patterns

### Pattern A · Two Layers: Dashboard + Cinematic Overlay

**Problem:** a pure cinematic often defaults to a black screen with a ▶ button. If the user reaches the page without clicking, they see nothing.

**Solution:**
```
DEFAULT state (always visible): complete static workflow dashboard
  └── The audience understands how the skill or workflow operates at a glance

CLICK ▶ to trigger (overlay rises): 22-second cinematic
  └── Automatically fades back to DEFAULT when complete
```

**Implementation notes:**
- `.dash` is visible by default; `.cinema` defaults to `opacity: 0; pointer-events: none`.
- `.play-cta` is a small gold button in the lower-right corner, not a large centered overlay.
- On click: `cinema.classList.add('show')` + `dash.classList.add('hide')`.
- Run once with `requestAnimationFrame`, not in a loop. Call `endCinematic()` at completion to reverse the state.

**Antipattern:** the default is a large centered ▶ overlay that covers everything, leaving the page blank before the click.

---

### Pattern B · Scene-Based, Not Step-Based

**Problem:** breaking an animation into “show step 1 → show step 2 → ...” is PowerPoint thinking.

**Solution:** divide it into five scenes. Each scene is an **independent shot** with exactly one full-screen focus:

| Scene Type | Responsibility | Duration |
|---|---|---|
| 1 · Invoke | User input triggers the workflow, such as a terminal typewriter | 3–4 s |
| 2 · Process | Visualize the core workflow in a distinctive visual language | 5–6 s |
| 3 · Result / Insight | Visualize the key artifact or insight extracted | 4–5 s |
| 4 · Output | Show the actual output: file, diff, or metric | 3–4 s |
| 5 · Hero Reveal | Closing hero moment: large type + value proposition | 4–5 s |

**Total duration ≈22 seconds**, the tested sweet spot:
- Under 18 seconds: the product manager has not settled in before it ends.
- Over 25 seconds: attention starts to fade.
- Twenty-two seconds is enough to hook → develop → resolve → leave an impression.

**Implementation notes:**
- Define one global timeline: `T = { DURATION: 22.0, s1_in: [0, 0.7], s2_in: [3.8, 4.6], ... }`.
- Use one `requestAnimationFrame(render)` loop for opacity and transform calculations across all scenes.
- Do not chain `setTimeout`; chains break easily and are difficult to debug.
- Use `expoOut`, `easeOut`, or cubic-bezier easing. **Never use linear motion.**

---

### Pattern C · Every Demo Must Have Its Own Visual Language

**Problem:** after finishing the first cinematic, the second lazily reuses the same template—the same orbit, pentagon, typewriter, and large hero type—with only the copy changed.

**Result:** the audience notices that two skills look identical, effectively saying, “These skills are no different.”

**Solution:** each workflow has a different core metaphor and therefore needs a different visual language.

**Comparison:**

| Dimension | Nuwa (distills a person) | Darwin (optimizes a skill) |
|---|---|---|
| Core metaphor | Gather → distill → write | Loop → evaluate → ratchet |
| Visual motion | Floating / radiating / pentagon | Cycling / rising / comparing |
| Scene 2 | 3D Orbit · eight archives floating around a perspective ellipse | Spin Loop · a token completes five laps around a six-node ring |
| Scene 3 | Pentagon · five tokens radiate from the center | v1 vs. v5 · side-by-side diff, red version vs. gold version |
| Scene 4 | `SKILL.md` typewriter | Hill-Climb · full-screen curve drawing |
| Scene 5 hero | “21 minutes” in large serif italics | Rotating gear ⚙ + gold “KEPT +1.1” tag |

**Test:** cover the copy and inspect only the visuals. Can you tell which demo it is? If not, the work is derivative.

---

### Pattern D · Use Real AI-Generated Assets, Not Emoji or Hand-Drawn SVG

**Problem:** a 3D orbit or gallery needs floating asset fragments. Emoji such as 📚 and 🎤 are unattractive and unbranded, while an SVG-drawn book spine never looks like a real book.

**Solution:** use `huashu-gpt-image` to generate one large 4 × 2 grid—eight thematically relevant objects, white background, 60 px breathing space, unified style—then extract eight independent transparent PNGs with `extract_grid.py --mode bbox`.

**Prompt essentials** (see the `huashu-gpt-image` skill for detailed prompt patterns):
- Anchor an identifiable visual world: “1960s Caltech archive aesthetic” or “Hearthstone-style consistent treatment.”
- Use a white background, which is easy to cut out. Gray creates atmosphere but makes transparent-background extraction difficult.
- Use 4 × 2, not 5 × 5, to avoid the final-row compression bug.
- Add persona-based finishing: “You are a Wired magazine curator preparing an exhibition photo.”

**Antipattern:** emoji as icons, or CSS silhouettes in place of product imagery.

---

### Pattern E · Two Audio Tracks: BGM + SFX

**Problem:** motion without sound subconsciously feels like “a bargain-basement demo.”

**Solution:** a continuous BGM bed plus eleven SFX cues.

**General SFX cue recipe for workflow demos:**

| Time | SFX | Trigger |
|---|---|---|
| 0.10 s | whoosh | Terminal rises from below |
| 3.0 s | enter | Typewriter finishes and Enter is pressed |
| 4.0 s | slide-in | Scene 2 elements enter |
| 5–9 s × five times | sparkle | Key process nodes: each generation, token, or data point |
| 14 s | click | Switch to the output scene |
| 17.8 s | logo-reveal | Hero reveal |
| During typewriter | type | Trigger once every two characters; keep density controlled |

**Frequency and level separation:** BGM volume 0.32 for the low-frequency bed; SFX volume 0.55 for a mid/high-frequency punch; sparkle 0.7 so it stands out; logo-reveal 0.85 for the strongest hero moment.

**User control:**
- A ▶ start control is mandatory because browsers restrict autoplay.
- Include a small mute button in the upper-right so the user can silence audio at any time.
- Never force sound to play as soon as the user reaches the slide.

---

## 2 · Static Dashboard Design

The dashboard is Layer 1 of the two-layer structure. A product manager who never clicks ▶ must still understand the skill.

**Layout:** use a three-column grid, or one large panel plus two small panels. Each panel answers one question:

| Panel Type | Question Answered | Example |
|---|---|---|
| **Pipeline / Flow Diagram** | “What is this skill's workflow?” | Nuwa four-stage pipeline · Darwin autoresearch loop |
| **Snapshot / State** | “What does the real output data look like?” | Darwin eight-dimension rubric snapshot |
| **Trajectory / Evolution** | “How does it change over repeated runs?” | Darwin five-generation hill-climb curve |
| **Examples / Gallery** | “What has already been produced?” | Nuwa gallery of 21 personas |
| **Strip · Example I/O** | “What goes in → what comes out?” | Nuwa example strip: `› nuwa distill Feynman → feynman.skill (21 min)` |

**Key constraints:**
- Information density must be sufficient; every panel should carry differentiating information.
- Do not add data slop; every number must mean something.
- Keep the palette consistent with the cinematic so switching between layers does not feel abrupt.

---

## 3 · Debugging and Development Tools

Every long animation needs three development tools. Without them, debugging becomes unmanageable.

### Tool 1 · Freeze at Second N with `?seek=N`

```js
const seek = parseFloat(params.get('seek'));
if (!isNaN(seek)) {
  started = true; muted = true;
  frozenT = seek;  // render() uses this t rather than elapsed time
  cinema.classList.add('show'); dash.classList.add('hide');
}

// Inside render():
let t = frozenT !== null ? frozenT : (elapsed % T.DURATION);
```

Usage: `http://.../slide.html?seek=12` displays the frame at 12 seconds immediately, with no wait for playback.

### Tool 2 · Skip the ▶ Overlay with `?autoplay=1`

Useful for automated Playwright screenshots and for forcing playback when embedded in an iframe.

### Tool 3 · Manual REPLAY Button

A small button in the upper-right lets users and developers replay the animation at any time. CSS:

```css
.replay{position:absolute;top:18px;right:18px;background:rgba(212,165,116,0.1);
  border:1px solid rgba(212,165,116,0.3);color:#D4A574;
  font-family:monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;
  padding:6px 12px;border-radius:1px;cursor:pointer;backdrop-filter:blur(6px);z-index:6}
```

---

## 4 · iframe Embedding Pitfalls

### Pitfall 1 · Parent-Window Click Zones Intercept Buttons Inside the iframe

If the deck's `index.html` adds transparent 22 vw left/right click zones for navigation, they can **cover the ▶ play button inside the iframe**. The user's click is swallowed and interpreted as “next slide.”

**Fix:** give the click zones `top: 12vh; bottom: 25vh`, leaving the top and bottom 25% unobstructed so both a centered ▶ and a lower-right ▶ inside the iframe remain clickable.

### Pitfall 2 · Keyboard Events Disappear After the iframe Takes Focus

After the user clicks inside an iframe, focus moves there and the parent window no longer receives ←/→ keyboard events.

**Fix:**
```js
iframe.addEventListener('load', () => {
  // Inject a keyboard-event forwarder
  const doc = iframe.contentDocument;
  doc.addEventListener('keydown', (e) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: e.key, ... }));
  });
  // Return focus to the parent window after a click
  doc.addEventListener('click', () => setTimeout(() => window.focus(), 0));
});
```

### Pitfall 3 · Different Behavior Under `file://` and `https://`

A cinematic tested locally under `file://` may fail after deployment because:
- Under `file://`, the iframe's `contentDocument` is same-origin.
- Under `https://`, it is also same-origin when served from the same host, but audio autoplay restrictions are stricter.

**Fix:**
- Before deployment, run `python3 -m http.server` and test under local HTTP.
- Call `bgm.play()` only after the user clicks ▶. Never play it immediately on page load.

---

## 5 · Antipattern Cheatsheet

| ❌ Antipattern | ✅ Correct Pattern |
|---|---|
| Default = black screen + ▶ overlay | Default = static dashboard; ▶ is secondary |
| Four horizontally arranged steps fade in on one screen | Five full-screen scene changes, one focus per scene |
| Reuse one template with different copy for every demo | Independent visual language for each demo, distinguishable even with copy hidden |
| Emoji / hand-drawn SVG used as imagery | One large `gpt-image-2` grid + cutouts from `extract_grid` |
| No BGM and no SFX | Two-layer BGM + eleven-SFX-cue system |
| Schedule with a `setTimeout` chain | `requestAnimationFrame` + global timeline object `T` |
| Linear animation | Exponential or cubic-bezier easing |
| No development tools | `?seek=N` + `?autoplay=1` + REPLAY button |
| Parent click zone swallows iframe buttons | Add top/bottom margins to the click zone to leave buttons accessible |

---

## 6 · Time Budget

Using these patterns, one complete cinematic demo including its dashboard takes:

| Task | Time |
|---|---|
| Design the five-scene narrative and visual language | 30 minutes; be deliberate, because this determines distinctiveness |
| Static dashboard layout + content | 1 hour |
| Implement five cinematic scenes | 1.5 hours |
| Time audio cues + add replay button | 30 minutes |
| Verify five key moments with Playwright screenshots | 15 minutes |
| **Total per demo** | **3–4 hours** |

A second demo can reuse the framework, but **its visual language must remain independent**; budget approximately 2–3 hours.
