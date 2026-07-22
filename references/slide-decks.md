# Slide Decks · Standards for HTML Presentations

Slide decks are a common design deliverable. This document covers the complete HTML-first workflow: architecture, individual slide design, and export to PDF or editable PPTX.

**This skill covers**:
- **HTML presentation (the baseline deliverable, always required)** → independent HTML files aggregated by `assets/deck_index.html`, with keyboard navigation and full-screen browser playback
- HTML → PDF export → `scripts/export_deck_pdf.mjs` / `scripts/export_deck_stage_pdf.mjs`
- HTML → editable PPTX export → `references/editable-pptx.md` + `scripts/html2pptx.js` + `scripts/export_deck_pptx.mjs` (requires compatible HTML or a separate export-compliant copy)

> **⚠️ HTML is the source; PDF and PPTX are derivatives.** First build an aggregated HTML presentation (`index.html` + `slides/*.html`). PDF exports directly from that source. Editable PPTX is best effort: export directly when the HTML is compatible, otherwise derive it from a separate compliant copy while keeping the canonical HTML unchanged.
>
> **Why HTML comes first**:
> - Best for talks and demos: present full-screen on a projector or shared screen, navigate by keyboard, and avoid dependence on Keynote or PowerPoint
> - During development, every slide can be opened and verified independently without re-running an export
> - It remains the canonical visual and content reference for every derivative
> - Delivery can include both HTML and PDF or both HTML and PPTX, giving the recipient a choice of medium
>
> Production validation, 2026-04-22, moxt brochure: after 13 HTML slides were assembled with `index.html`, `export_deck_pdf.mjs` produced the PDF in one command with no source changes. The HTML version was already ready for browser-based delivery.

---

## 🛑 Default delivery chain: HTML first, then PDF

Do not ask the user to choose a format before starting. The baseline is an aggregated HTML deck, followed automatically by a PDF export. Create an editable PPTX only when the user explicitly requests one; it is a best-effort derivative and must not weaken the canonical HTML design.

### Decision Tree (HTML-first architecture)

Every delivery starts from the same aggregated HTML deck (`index.html` + `slides/*.html`). The PDF comes from that source without design compromises. If editable PPTX is requested, use a separate export-compliant derivative when the canonical HTML contains unsupported effects:

```
[Always required] Aggregated HTML presentation (index.html + slides/*.html)
   │
   ├── Browser presentation / local HTML archive  → HTML retains full visual freedom
   │
   ├── Default PDF derivative                     → Run export_deck_pdf.mjs
   │                                                No source redesign required
   │
   └── Editable PPTX explicitly requested         → Try export_deck_pptx.mjs
                                                    If needed, build a separate compliant HTML copy
                                                    Report any lost effects or font substitutions
```

### Delivery statement (copy and use when clarification is helpful)

> I will build the deck as an aggregated HTML presentation with keyboard navigation and export the matching PDF automatically. If colleagues also need to edit the copy in PowerPoint, tell me and I will add a best-effort editable PPTX derivative without reducing the quality of the HTML source.

### Why editable PPTX may require a separate derivative

For a PPTX to remain editable, `html2pptx.js` must translate DOM elements into native PowerPoint objects. An export-compliant HTML derivative therefore has to follow these constraints:

1. body is fixed at 960pt × 540pt (matches `LAYOUT_WIDE`, 13.333″ × 7.5″, not 1920×1080px)
2. Wrap all text in `<p>` or `<h1>`–`<h6>`; do not put text directly in a `<div>` or use `<span>` for primary text
3. Do not put backgrounds, borders, or shadows directly on `<p>` or heading elements; place those styles on an outer `<div>`
4. `<div>` cannot use `background-image` (use the `<img>` tag)
5. Do not use CSS gradients, web components, or complex decorative SVG.

The canonical HTML workflow permits extensive visual freedom: spans, nested flex layouts, complex SVG, web components such as `<deck-stage>`, and CSS gradients. Most of these patterns do not translate cleanly through `html2pptx`; in production tests, fewer than 30% of visually driven slides passed unchanged. Preserve the canonical source and adapt a copy for PPTX when necessary.

### Cost comparison from a production incident (2026-04-20)

| Path | Approach | Result | Cost |
|------|------|------|------|
| ❌ **Assume a visually rich HTML deck will convert to editable PPTX unchanged** | Single-file `deck-stage` plus extensive SVG and `<span>` decoration | Either handwrite hundreds of `pptxgenjs` coordinates or rebuild all 17 slides in an export-compliant derivative | 2–3 hours of unexpected rework |
| ✅ **Keep the HTML canonical and plan the PPTX derivative explicitly when requested** | Independent HTML per slide; export-compliant copy only where required | HTML and PDF preserve full visual quality; PPTX remains editable within documented limitations | About five extra minutes per affected slide, with losses reported clearly |

### What to do with mixed delivery

If the user wants an HTML presentation **and** editable PPTX, keep the visual HTML as the source of truth. Export directly when it already meets the constraints; otherwise create a separate compliant copy for PPTX conversion.

If the user wants editable PPTX **and** animation or web components, explain that those effects cannot survive as native editable PowerPoint objects. Preserve them in HTML/PDF, simplify only the PPTX derivative, and state exactly what changed. Do not silently create a handwritten `pptxgenjs` implementation; it becomes permanent maintenance debt.

### What to do if you find out later that PPTX is required (emergency remedy)

If editable PPTX becomes a requirement only after the HTML is complete, use this **fallback process**. Full instructions appear under “Fallback: a visual draft exists, but the user insists on editable PPTX” in `references/editable-pptx.md`.

1. **First choice: export PDF.** It preserves the visuals exactly, works across platforms, and supports viewing and printing. If the real need is presenting or archiving, PDF is the strongest deliverable.
2. **Second choice: rebuild the visual draft as export-compliant HTML**, then export an editable PPTX. Preserve the color, layout, and copy decisions while giving up gradients, web components, complex SVG, and other unsupported effects.
3. **Last resort: reconstruct the deck by hand in `pptxgenjs`.** Every position, font, and alignment must be tuned manually, and every later HTML edit must also be synchronized by hand.

Explain the options before undertaking a costly manual reconstruction. **Do not begin with handwritten `pptxgenjs`**; reserve it for cases where no maintainable alternative works.

---

## 🛑 Before full production, design two showcase slides

**For any deck of five slides or more, do not build from first slide to last in one pass.** The production-validated order from the 2026-04-22 moxt brochure is:

1. Select the **two most visually different slide types** and design them first—for example, a cover plus a quote slide, or a cover plus a product slide.
2. Capture screenshots and ask the user to approve the visual grammar: masthead, typography, color, spacing, structure, and balance between languages.
3. Once approved, build the remaining N−2 slides in batches using the same grammar.
4. After all slides are complete, aggregate the HTML and produce any PDF/PPTX derivatives

**Why**: if a 13-slide deck is rejected after the first review, all 13 slides need rework. With two showcase slides, the same rejected direction affects only two. Once the visual grammar is approved, later decisions narrow to content placement.

**Selection principle**: choose the two slides with the most different visual structures. If both work within one system, the intermediate slide types usually will too.

| Deck type | Recommended showcase page combination |
|-----------|---------------------|
| B2B brochure / product announcement | Cover + content page (idea/emotion page) |
| Brand release | Cover + product feature page |
| Data report | Data overview + analytical conclusion |
| Tutorial or course deck | Chapter divider + detailed concept slide |

---

## 📐 Publication-style grammar (validated on moxt and reusable)

Suitable for B2B brochures, product promotions, and long-form report decks. Reusing this structure creates a coherent 13-slide system with no stylistic rework.

### Slide skeleton

```
┌─ masthead (top strip + horizontal rule)────────────┐
│  [logo 22-28px] · A Product Brochure                Issue · Date · URL │
├──────────────────────────────────────────┤
│                                          │
│  ── kicker (short green rule + uppercase label)     │
│  CHAPTER XX · SECTION NAME                 │
│                                          │
│  H1 (Noto Serif SC 900 for Chinese)          │
│  Set selected key words in the brand color   │
│                                          │
│  English subtitle (Lora Italic)              │
│  ─────────── Separator line ──────────            │
│                                          │
│  [Content: 60/40 split / 2×2 grid / list]       │
│                                          │
├──────────────────────────────────────────┤
│ section name                     XX / total │
└──────────────────────────────────────────┘
```

### Style convention (copied directly)

- **H1**: Noto Serif SC 900 for Chinese, 80–140px depending on content length. Color only selected key words with the brand primary; never color the entire heading
- **English sub**: Lora italic 26-46px, brand signature words (such as "AI team") bold + main color italic
- **Text**: Noto Serif SC 17-21px, line-height 1.75-1.85
- **Accent highlight**: use the primary color and bold weight on no more than three key phrases per slide; overuse destroys the anchoring effect
- **Background**: warm off-white `#FAFAFA` plus a faint radial-gradient texture (`rgba(33,33,33,0.015)`) for a paper-like feel

### Vary the visual protagonist

Thirteen repetitions of “text plus screenshot” become monotonous. **Rotate the visual protagonist across slides**:

| Visual type | Suitable section |
|---------|---------------|
| Cover composition (oversized type + masthead + vertical rule) | Opening slide / chapter divider |
| Single-person portrait, possibly oversized | Introduce one concept or persona |
| Group portrait or side-by-side avatar cards | Team / user story |
| Timeline card progression | Show "long-term relationship" and "evolution" |
| Knowledge graph / connection node graph | Show "collaboration" and "flow" |
| Before/After Comparison card + middle arrow | Show "change" and "difference" |
| Product UI screenshot in an outlined device frame | Feature demonstration |
| Oversized quotation occupying half the slide | Emotional turn / question / quotation |
| Portrait + quote cards in a 2×2 or 1×4 arrangement | Testimonials / usage scenarios |
| Oversized closing type + pill-shaped URL button | CTA / ending |

---

## ⚠️ Common pitfalls (moxt practical summary)

### 1. Emoji may not render in Chromium / Playwright exports

Chromium may not have a color-emoji font available. In `page.pdf()` or `page.screenshot()` output, emoji can therefore appear as empty boxes.

**Countermeasure**: Replace with Unicode text symbols (`✦` `✓` `✕` `→` `·` `—`), or directly change to plain text ("Email · 23" instead of "📧 23 emails").

### 2. `export_deck_pdf.mjs` error `Cannot find package 'playwright'`

Cause: Node resolves an ESM module's dependencies by searching upward from the script's location. If the script lives under `~/.claude/skills/huashu-design/scripts/`, it will not find the project's `node_modules`.

**Countermeasure**: Copy the script to the deck project directory (for example, `brochure/build-pdf.mjs`), run `npm install playwright pdf-lib` at the project root, and then `node build-pdf.mjs --slides slides --out output/deck.pdf`.

### 3. Capturing before Google Fonts loads causes fallback typography

Before taking a Playwright screenshot or PDF, wait at least 3.5 seconds for web fonts to download and paint. Better still, self-host them under `shared/fonts/` to reduce network dependence.

### 4. Unbalanced information density

The first version of the moxt philosophy slide contained four paragraphs in a 2×2 grid plus three principles at the bottom: seven cramped, repetitive content blocks. Reducing it to three horizontal segments immediately restored breathing room.

**Countermeasure**: Limit each slide to one core message, three or four supporting points, and one visual protagonist. If the content exceeds that budget, split it across slides. **Less is more**: an audience viewing a slide for ten seconds is far more likely to retain one idea than four.

---

## 🛑 Determine the structure first: single file or multiple files?

**Choose the architecture before designing slides. A wrong choice creates recurring problems throughout the deck, so read this section first.**

### Comparison of two architectures

| Dimension | Single file + `deck_stage.js` | **Multiple files + `deck_index.html` aggregator** |
|------|--------------------------|--------------------------------------|
| Code structure | One HTML file; every slide is a `<section>` | One HTML file per slide; `index.html` assembles them with iframes |
| CSS scope | ❌ Global, the style of one page may affect all pages | ✅ Natural isolation, each iframe has its own world |
| Verification granularity | ❌ Reaching a specific slide requires JavaScript `goTo` | ✅ Open any slide file directly in the browser |
| Parallel development | ❌ Multiple contributors collide in one file | ✅ Contributors can work on separate slides with no merge conflicts |
| Debugging difficulty | ❌ One CSS error can break the entire deck | ✅ An error is isolated to one slide |
| Embedded interaction | ✅ Sharing state across slides is straightforward | 🟡 Cross-iframe state requires `postMessage` |
| Print PDF | ✅ Built in | ✅ The aggregator traverses iframes during `beforeprint` |
| Keyboard navigation | ✅ Built in | ✅ Built into the aggregator |

### Which one to choose? (Decision Tree)

```
│ How many slides will the deck contain, and does it need shared state?
├── ≤5 slides, with cross-slide interaction and no overview-wall requirement → Single file
└── >5 slides, lecture/course deck, overview wall, or parallel production → Multiple files (default)
```

**Use the multi-file path by default.** It is the primary architecture for long decks and collaborative production, not a secondary option. Multi-file decks retain keyboard navigation, printing, and scaling while adding isolation and direct per-slide verification that a single file cannot provide.

### Why the rule is strict: a production failure

A single-file architecture caused four separate failures in an AI-psychology lecture deck:

1. **CSS specificity collision**: `.emotion-slide { display: grid }` overrode `deck-stage > section { display: none }`, so every slide rendered at once and overlapped.
2. **Shadow DOM slot rule defeated by outer CSS**: `::slotted(section) { display: none }` could not suppress the higher-specificity outer rule, so sections remained visible.
3. **`localStorage` and hash-navigation race**: after refresh, the deck restored the stale stored position instead of the slide named by the URL hash.
4. **Expensive verification**: capturing one slide required `page.evaluate(d => d.goTo(n))`, which was slower and less reliable than opening `slides/05-X.html` directly.

The common root cause was a single global namespace. A multi-file architecture removes that class of problem structurally.

---

## Path A (default): Multi-file architecture

### Directory structure

```
MyDeck/
├── index.html              # Copy assets/deck_index.html and edit MANIFEST
├── shared/
│   ├── tokens.css          # Shared design tokens: colors, type scale, recurring chrome
│   └── fonts.html          # Google Fonts <link> elements included by every slide
└── slides/
    ├── 01-cover.html       # Each file is a complete 1920×1080 HTML document
    ├── 02-agenda.html
    ├── 03-problem.html
    └── ...
```

### The template skeleton of each slide

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>P05 · Chapter Title</title>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="../shared/tokens.css">
<style>
  /* Slide-specific styles cannot leak into other iframe-isolated slides. */
  body { padding: 120px; }
  .my-thing { ... }
</style>
</head>
<body>
  <!-- 1920×1080 canvas, locked by the body rule in tokens.css -->
  <div class="page-header">...</div>
  <div>...</div>
  <div class="page-footer">...</div>
</body>
</html>
```

**Key constraints**:
- `<body>` is the canvas, laid out directly on it. Do not wrap `<section>` or other wrappers.
- `width: 1920px; height: 1080px` is locked by the `body` rule in `shared/tokens.css`.
- Reference `shared/tokens.css` for shared design tokens such as colors, type scale, and the page header/footer.
- Include the font `<link>` in every slide. This keeps each file independently viewable, and the browser will cache repeated font requests.

### Aggregator: `deck_index.html`

Copy `assets/deck_index.html`. The only required change is the `window.DECK_MANIFEST` array, which lists every slide file and its human-readable label in order:

```js
window.DECK_MANIFEST = [
  { file: "slides/01-cover.html",    label: "Cover" },
  { file: "slides/02-agenda.html",   label: "Table of Contents" },
  { file: "slides/03-problem.html",  label: "Problem Statement" },
  // ...
];
```

The aggregator provides keyboard navigation (←/→/Home/End, number keys, and P for print), scaling with letterboxing, a bottom-right counter, `localStorage` position memory, hash-based navigation, and print mode that traverses every iframe.

#### Two adaptive overview modes (revised in 2026-06)

The deck opens in **overview mode** by default. Unless explicitly configured, it chooses between **grid (60%)** and **infinite gallery (40%)** using the current seconds value. Fix the mode with `?ov=grid|gallery` or `window.DECK_OVERVIEW = 'grid' | 'gallery'`.

- **Grid (primary default)**: renders the real slide documents in **iframes**, so it is crisp and WYSIWYG with no thumbnail generation. It adapts to slide count: if everything fits, the wall is centered with a slight diagonal tilt; if not, cards retain a readable size and the page scrolls vertically. Never shrink dozens of slides into postage stamps just to force them onto one screen.
- **Infinite gallery**: creates a seamless tiled field of all slides with slow drift and a subtle breathing zoom. Slides are shuffled, then repeated after every slide has appeared. Because the field contains many tiles, use `<img>` thumbnails for performance; if a thumbnail is missing, the view falls back to an iframe.

🛑 **Three production-tested constraints for this file**:

1. **Never build the overview wall with `transform-style: preserve-3d`.** Browser hit testing becomes unreliable for cards that recede into the scene: the top row may be unclickable and middle rows intermittent. Instead, make the entire wall one tilted 3D plane while keeping all cards coplanar. Use a 2D `scale` on hover, not `translateZ`.
2. **The layout must adapt to any slide count.** A fixed column count plus a strong wall tilt will overflow and distort as the deck grows. Calculate columns from the slide count and viewport; reduce the tilt as row count grows; and enable scrolling whenever the wall cannot fit on one screen.
3. **Do not undersize thumbnails.** Gallery thumbnails below 1000px become blurry when enlarged on hover. Use 1600px by default.

**Generate thumbnails for gallery**: Use `scripts/gen_deck_thumbs.mjs` (playwright crop each page + sharp downsampling):
```bash
npm install playwright sharp
node gen_deck_thumbs.mjs --slides slides --out thumbs --width 1600
```
Then add `thumb: "thumbs/<same-name>.jpg"` to each MANIFEST item. Grid mode ignores thumbnails and always uses iframes; only gallery mode uses them.

### Per-slide validation: the decisive advantage of multi-file decks

Each slide is independent HTML. **After finishing one, double-click to open it in the browser**:

```bash
open slides/05-personas.html
```

Playwright can likewise call `goto(file://.../slides/05-personas.html)` directly. No JavaScript navigation is required, and no other slide's CSS can interfere. That makes the edit-and-check loop almost frictionless.

### Parallel development

Assign different slides to different agents or contributors. Because the HTML files are independent, the work can run in parallel without merge conflicts. For long decks, this can reduce production time substantially.

### What belongs in `shared/tokens.css`

Only put things that are truly shared across pages:

- CSS variables (color palette, font size level, spacing level)
- The canvas lock: `body { width: 1920px; height: 1080px; }`
- Exactly shared chrome such as `.page-header` and `.page-footer`

Do **not** add layout classes used by only one slide. That recreates the global-style pollution the multi-file architecture was meant to eliminate.

---

## Path B (small decks): single file + `deck_stage.js`

Use this path only for decks of five slides or fewer when slides must share state—for example, when one React Tweaks panel controls the whole deck—and no overview wall is required.

### Basic usage

1. Load `assets/deck_stage.js`, either inline or with `<script src="deck_stage.js">`.
2. Wrap the slide `<section>` elements in `<deck-stage>`.
3. 🛑 Place the `<script>` element **after `</deck-stage>`**; see the hard constraint below.

```html
<body>

  <deck-stage>
    <section>
      <h1>Slide 1</h1>
    </section>
    <section>
      <h1>Slide 2</h1>
    </section>
  </deck-stage>

  <!-- ✅ Correct: script follows deck-stage -->
  <script src="deck_stage.js"></script>

</body>
```

### 🛑 Script-position constraint (production issue, 2026-04-20)

Do not place `<script src="deck_stage.js">` in `<head>` without `defer`. Although it can register the custom element there, the parser invokes `connectedCallback` as soon as it reaches the opening `<deck-stage>` tag. At that moment, its child `<section>` elements have not yet been parsed, so `_collectSlides()` receives an empty array, the counter shows `1 / 0`, and all slides may overlap.

Use one of these three valid patterns:

```html
<!-- ✅ Recommended: script after </deck-stage> -->
</deck-stage>
<script src="deck_stage.js"></script>

<!-- ✅ Also valid: script in head with defer -->
<head><script src="deck_stage.js" defer></script></head>

<!-- ✅ Also valid: module scripts are deferred by default -->
<head><script src="deck_stage.js" type="module"></script></head>
```

`deck_stage.js` includes a defensive delayed collection on `DOMContentLoaded`, so a script in the head may recover. Still, `defer` or a script at the end of the body is cleaner and avoids relying on the fallback branch.

### ⚠️ CSS pitfalls of single-file architecture (must read)

The most common single-file failure is a slide-specific rule overriding the stage's `display` control.

Common mistake 1: applying `display: flex` directly to every section:

```css
/* ❌ Light-DOM CSS overrides ::slotted(section) { display: none; } */
deck-stage > section {
  display: flex;            /* All pages will be overlaid and rendered at the same time! */
  flex-direction: column;
  padding: 80px;
  ...
}
```

Common mistake 2: using a higher-specificity class on the section:

```css
.emotion-slide { display: grid; }   /* Higher specificity; even worse */
```

Both rules make **every slide render at once and overlap**. The counter may still show `1 / 10`, but visually the first slide covers the second, the second covers the third, and so on.

### ✅ Safe starter CSS

Let the **section itself** control only visibility. Put layout declarations such as flex or grid on `.active`:

```css
/* Shared section styles, but no display declaration */
deck-stage > section {
  background: var(--paper);
  padding: 80px 120px;
  overflow: hidden;
  position: relative;
  /* ⚠️ Do not set display here. */
}

/* Force inactive slides to remain hidden. */
deck-stage > section:not(.active) {
  display: none !important;
}

/* Apply visibility and layout only to the active slide. */
deck-stage > section.active {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Print mode: show every slide, overriding :not(.active). */
@media print {
  deck-stage > section { display: flex !important; }
  deck-stage > section:not(.active) { display: flex !important; }
}
```

An even cleaner alternative is to put each slide's flex/grid layout on an inner `<div>`, leaving the section itself as a pure `display: block/none` switch:

```html
<deck-stage>
  <section>
    <div class="slide-content flex-layout">...</div>
  </section>
</deck-stage>
```

### Custom size

```html
<deck-stage width="1080" height="1920">
  <!-- 9:16 vertical format -->
</deck-stage>
```

---

## Slide Labels

Both `deck_stage` and `deck_index` display a slide label in the counter. Use **meaningful** labels:

**Multiple files**: write `{ file, label: "04 Problem Statement" }` in `MANIFEST`.
**Single file**: Add `<section data-screen-label="04 Problem Statement">` to the section

**Key: Slide numbering starts from 1, not from 0**.

When a user says “slide 5,” they mean the fifth slide, not array index `[4]`. Keep all user-facing numbering one-based.

---

## Speaker notes

**Not added by default**, only added when explicitly requested by the user.

Speaker notes let the slide remain visually concise while the notes carry the complete spoken script.

### Format

**Multiple files**: In `index.html`’s `<head>` write:

```html
<script type="application/json" id="speaker-notes">
[
  "Script for slide 1...",
  "Script for slide 2...",
  "..."
]
</script>
```

**Single file**: Same location as above.

### Writing the notes

- **Complete**: write the actual spoken script, not an outline.
- **Conversational**: use natural speech rather than formal written prose.
- **Aligned**: the Nth array item corresponds to the Nth slide.
- **Length**: aim for 200–400 words per slide.
- **Performance cues**: mark pauses, stresses, and emotional turns.

---

## Slide design patterns

### 1. Establish a system (must do)

After reviewing the design context, **state the intended system before designing slides**:

```markdown
DeckSystem:
- Backgrounds: no more than two (90% white slides, 10% dark section dividers)
- Type: Instrument Serif for display, Geist Sans for body text
- Rhythm: full-bleed section dividers with white type; white content slides
- Imagery: full-bleed photography on hero slides; charts on data slides

I will follow this system unless you want to adjust it.
```

Proceed after the user confirms the system.

### 2. Commonly used slide layouts

- **Title slide**: solid color background + huge title + subtitle + author/date
- **Section divider**: color background + chapter number + chapter title
- **Content slide**: white background + title + 1-3 bullet points
- **Data slide**: title + large chart/number + short description
- **Image slide**: full-bleed photo + small caption at the bottom
- **Quote slide**: blank + huge quote + attribution
- **Two-column**: left/right comparison (versus, before/after, or problem/solution)

Use no more than four or five layout families in one deck.

### 3. Scale (emphasis again)

- Body text: minimum **24px**, ideally 28–36px
- Titles: **60–120px**
- Hero text: **180–240px**
- Slides are viewed from across a room; type must remain readable from ten meters away

### 4. Visual rhythm

A deck requires **intentional variation**:

- Color rhythm: mostly white background + occasional color section divider + occasional dark fragment
- Density rhythm: some text-led slides, some image-led slides, and some spacious quote slides
- Font size rhythm: normal titles + occasional giant hero text

**Do not give every slide the same density**—that produces a template, not a designed sequence.

### 5. Breathing room on data-intensive slides

**The most common beginner mistake** is cramming every available detail onto one slide.

Information density is not the same as effective communication. Take particular care with academic and lecture decks:

- List or matrix slides: do not render all N items at the same size. Create **primary and secondary layers**—for example, enlarge the five items discussed in the talk and reduce the other sixteen to contextual background.
- Big-number slides: the numbers are the visual protagonist. Keep surrounding copy to three lines or fewer so the viewer's eye does not bounce between competing blocks.
- Quote slides: leave visible space between the quotation and attribution.

Ask two questions: “Is the data still the protagonist?” and “Is the text crowded?” Keep removing content until the amount of empty space feels almost uncomfortable.

---

## Print to PDF

**Multiple files**: `deck_index.html` handles `beforeprint`, traversing the slide iframes so each becomes one PDF page.

**Single file**: `deck_stage.js` handles printing similarly. The print styles are already included; no additional `@media print` CSS is required.

---

## Export to PPTX/PDF (self-service script)

HTML remains the canonical source, but users often also need PPTX or PDF. The scripts under `scripts/` work with any multi-file deck:

### `export_deck_pdf.mjs` — Export vector PDF (multi-file architecture)

```bash
node scripts/export_deck_pdf.mjs --slides <slides-dir> --out deck.pdf
```

**Features**:
- Text **preserves vectors** (copyable, searchable)
- 100% visual fidelity (Playwright embedded Chromium rendering and printing)
- **No HTML content changes required**
- Each slide is independent of `page.pdf()`, and then merged with `pdf-lib`

**Dependencies**: `npm install playwright pdf-lib`

**Limitation**: PDF text is selectable and searchable but not conveniently editable. Make content changes in the HTML source and re-export.

### `export_deck_stage_pdf.mjs` — PDF export for single-file `deck-stage` decks ⚠️

**When to use it**: the deck is one HTML file whose `<deck-stage>` component wraps N `<section>` elements—Path B. In this architecture, `export_deck_pdf.mjs` cannot produce one PDF page per slide, so use the dedicated script.

```bash
node scripts/export_deck_stage_pdf.mjs --html deck.html --out deck.pdf
```

**Why `export_deck_pdf.mjs` cannot be reused** (production issue, 2026-04-20):

1. **Shadow DOM defeats light-DOM `!important`**: the stage's shadow CSS contains `::slotted(section) { display: none }`, with only the active slide shown. A light-DOM rule such as `@media print { deck-stage > section { display: block !important } }` cannot reliably override it. When `page.pdf()` activates print media, Chromium may render only the active slide, producing a **one-page PDF**.

2. **Looping through hashes still captures the wrong slide**: the intuitive solution—navigate to each `#slide-N` and run `page.pdf({ pageRanges: '1' })`—also fails. Once print CSS changes section visibility, Chromium can render the first section rather than the navigated slide. A 17-slide deck then becomes 17 copies of P01.

3. **Absolutely positioned children spill onto another page**: if a section remains `position: static`, absolute children such as `.cover-footer` and `.slide-footer` are positioned relative to the initial containing block. When print mode forces the section to 1080px high, a footer can land on an extra page, leaving a one-element orphan page.

**Implemented repair strategy**:

```js
// Extract sections from the deck-stage slot and append them to a normal body div.
// Inline styles enforce fixed dimensions and position: relative.
await page.evaluate(() => {
  const stage = document.querySelector('deck-stage');
  const sections = Array.from(stage.querySelectorAll(':scope > section'));
  document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: `
      @page { size: 1920px 1080px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; }
      deck-stage { display: none !important; }
    `,
  }));
  const container = document.createElement('div');
  sections.forEach(s => {
    s.style.cssText = 'width:1920px!important;height:1080px!important;display:block!important;position:relative!important;overflow:hidden!important;page-break-after:always!important;break-after:page!important;background:#F7F4EF;margin:0!important;padding:0!important;';
    container.appendChild(s);
  });
  // Disable the break after the last slide to avoid a trailing blank page.
  sections[sections.length - 1].style.pageBreakAfter = 'auto';
  sections[sections.length - 1].style.breakAfter = 'auto';
  document.body.appendChild(container);
});

await page.pdf({ width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
```

**Why this works**:
- Moving sections from the shadow-DOM slot into a normal light-DOM `<div>` bypasses `::slotted(section) { display: none }` completely.
- Inline `position: relative` anchors absolute children to their own slide.
- `page-break-after: always` gives every section its own page.
- Removing the final break prevents a trailing blank page.

**A note about `mdls -name kMDItemNumberOfPages`**: macOS caches Spotlight metadata. After overwriting a PDF, run `mdimport file.pdf` to refresh it or the old page count may remain. For an authoritative count, use `pdfinfo` or count pages rendered by `pdftoppm`.

---

### `export_deck_pptx.mjs` — Export editable PPTX

```bash
# The only mode: native editable text boxes; fonts may fall back to system fonts.
node scripts/export_deck_pptx.mjs --slides <dir> --out deck.pptx
```

How it works: `html2pptx` reads each element's computed style and translates the DOM into native PowerPoint objects—text boxes, shapes, and images. Text remains genuinely editable in PowerPoint.

**Hard constraints** (the export HTML must meet them or the page is skipped; see `references/editable-pptx.md` for details):
- All text must be inside `<p>`, `<h1>`–`<h6>`, `<ul>`, or `<ol>` elements; bare text in `<div>` is prohibited.
- A `<p>` or heading element cannot carry a background, border, or shadow; place those styles on an outer `<div>`.
- Do not inject decorative text through `::before` or `::after`; pseudo-elements cannot be extracted.
- Inline elements (span/em/strong) cannot have margin
- Do not use CSS gradients; they cannot be rendered.
- Do not use `background-image` on a `<div>`; use an `<img>` element.

The script includes an **automatic preprocessor** that wraps bare text in leaf `<div>` elements with `<p>` while preserving the class. This fixes the most common violation, but other constraints—such as borders on `<p>` or margins on `<span>`—still require compliant source HTML.

**Font fallback caveat**:
- Playwright uses web fonts to measure text-box dimensions; PowerPoint and Keynote render with locally installed fonts.
- When the two differ, **overflow or misalignment** can result; inspect every exported slide visually
- Install the HTML font on the target machine, or use `system-ui` as a predictable fallback.

**For visual-first work, choose PDF instead.** `export_deck_pdf.mjs` preserves the design exactly in a cross-platform, vector, searchable format. In this workflow, PDF is the native derivative of a visual-first deck, not a second-rate substitute for PPTX.

### Make the PPTX derivative export-friendly

For the most reliable editable export, make the PPTX-specific HTML copy satisfy the constraints before running `export_deck_pptx.mjs`. Do not remove effects from the canonical HTML merely to make conversion easier:

```html
<!-- ❌ Bad -->
<div class="title">Key findings</div>

<!-- ✅ Good: text is in a supported element -->
<p class="title">Key Findings</p>

<!-- ❌ Bad: border applied directly to p -->
<p class="stat" style="border-left: 3px solid red;">41%</p>

<!-- ✅ Good: border belongs to an outer div -->
<div class="stat-wrap" style="border-left: 3px solid red;">
  <p class="stat">41%</p>
</div>
```

### When to choose which one

| Scenario | Recommendation |
|------|------|
| Organizer handoff or archive | **PDF**: universal, high-fidelity, and searchable |
| Collaborators need to revise the copy | **Editable PPTX**, accepting possible font fallback |
| Live talk with fixed content | **PDF**: vector fidelity and cross-platform consistency |
| HTML is the preferred medium | Present directly in the browser; exports are backups |

## Editable PPTX as a long-term workflow

If a deck will be maintained and revised collaboratively over time, keep the visual HTML canonical and maintain an export-compliant derivative only when PowerPoint editability is a real requirement. See `references/editable-pptx.md` for the constraints, template, troubleshooting checklist, and fallback workflow for an existing visual draft.

---

## FAQ

**Multi-file deck: an iframe is blank or fails to load**
→ Verify that the MANIFEST `file` path is correct relative to `index.html`. In DevTools, copy the iframe `src` and confirm that it opens directly.

**Multi-file deck: one slide appears to conflict with another slide's styles**
→ Iframe isolation prevents cross-slide CSS conflicts. The likely cause is stale cache; force-refresh with Cmd+Shift+R.

**Single-file deck: multiple slides render on top of one another**
→ This is a CSS-specificity issue. See “CSS pitfalls of single-file architecture” above.

**Single-file deck: scaling looks wrong**
→ Confirm that every slide is a direct `<section>` child of `<deck-stage>`; do not insert an intermediate `<div>`.

**Single-file deck: jump to a specific slide**
→ Add a hash to the URL: `index.html#slide-5` opens the fifth slide.

**Both architectures: text shifts between screens**
→ Use a fixed 1920×1080 canvas and `px` units; avoid `vw`, `vh`, and `%`. The stage handles scaling uniformly.

---

## Verification checklist (must go through after completing the deck)

1. [ ] Open `index.html` (or the main HTML file) directly in the browser; confirm that the first view has no broken images and all fonts load.
2. [ ] Press → through every slide; confirm that there are no blank slides or layout shifts.
3. [ ] Press P for print preview; confirm that each slide occupies exactly one A4 or 1920×1080 page without cropping.
4. [ ] Force-refresh three randomly selected slides with Cmd+Shift+R; confirm that `localStorage` position memory still behaves correctly.
5. [ ] Capture all slides with Playwright: traverse `slides/*.html` for a multi-file deck or call `goTo` for a single-file deck. Inspect every image visually.
6. [ ] Search for residual `TODO` or `placeholder` markers and remove them.
