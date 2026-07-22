# Editable PPTX Export: HTML Hard Constraints, Size Decisions, and Common Errors

This document covers the path that uses **`scripts/html2pptx.js` + `pptxgenjs` to translate HTML elements into genuinely editable PowerPoint text boxes**. It is the only path supported by `export_deck_pptx.mjs`.

> **Core prerequisite:** to use this path, write the HTML under the four constraints below from the very first line. **This is not a post-production conversion.** Retrofitting a finished file creates two to three hours of rework, as measured on the 2026-04-20 Options Private Board project.
>
> When visual freedom has priority—animation, web components, CSS gradients, or complex SVG—use the PDF path instead (`export_deck_pdf.mjs` / `export_deck_stage_pdf.mjs`). **Do not** expect PPTX export to preserve full visual fidelity while remaining editable. That tradeoff is imposed by the PPTX file format itself; see “Why the Four Constraints Are Physical Constraints, Not Bugs” below.

---

## Canvas Size: Use 960 × 540 pt (`LAYOUT_WIDE`)

PPTX units are **inches**, a physical size, not pixels. The rule is that the body's `computedStyle` dimensions must **match the presentation layout's dimensions in inches** within ±0.1″; `validateDimensions` in `html2pptx.js` enforces this.

### Comparing Three Candidate Sizes

| HTML Body | Physical Size | PPT Layout | When to Choose It |
|---|---|---|---|
| **`960pt × 540pt`** | **13.333″ × 7.5″** | **pptxgenjs `LAYOUT_WIDE`** | ✅ **Recommended default**; the modern PowerPoint 16:9 standard |
| `720pt × 405pt` | 10″ × 5.625″ | Custom | Only when the user specifies the legacy PowerPoint Widescreen template |
| `1920px × 1080px` | 20″ × 11.25″ | Custom | ❌ Nonstandard; type appears abnormally small when projected |

**Do not think of HTML dimensions as resolution.** PPTX is a vector document; body dimensions control **physical size**, not sharpness. A huge 20″ × 11.25″ body does not make type clearer. It makes point sizes smaller relative to the canvas and therefore harder to read in projection or print.

### Three Equivalent Ways to Define the Body

```css
body { width: 960pt;  height: 540pt; }    /* Clearest; recommended */
body { width: 1280px; height: 720px; }    /* Equivalent; convenient when thinking in px */
body { width: 13.333in; height: 7.5in; }  /* Equivalent; convenient when thinking in inches */
```

Matching pptxgenjs code:

```js
const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inches; no custom layout required
```

---

## Four Hard Constraints (Violations Fail Immediately)

`html2pptx.js` translates the HTML DOM element by element into PowerPoint objects. The following four HTML rules are direct projections of PowerPoint's formatting constraints.

### Rule 1: A DIV Cannot Contain Bare Text—Wrap It in `<p>` or `<h1>`–`<h6>`

```html
<!-- ❌ Wrong: text directly inside a div -->
<div class="title">Q3 revenue grew by 23%</div>

<!-- ✅ Correct: text inside <p> or <h1>–<h6> -->
<div class="title"><h1>Q3 revenue grew by 23%</h1></div>
<div class="body"><p>New users were the primary driver</p></div>
```

**Why:** PowerPoint text must live inside a text frame. Text frames correspond to paragraph-level HTML elements: `p`, headings, and `li`. A bare `<div>` has no equivalent PowerPoint text container.

Do not use `<span>` for primary text either. A span is inline and cannot align independently as a text box. Use spans **inside `p` or headings** only for local styling such as bold or a color change.

### Rule 2: CSS Gradients Are Unsupported—Use Solid Colors

```css
/* ❌ Wrong */
background: linear-gradient(to right, #FF6B6B, #4ECDC4);

/* ✅ Correct: solid color */
background: #FF6B6B;

/* ✅ When multicolor stripes are essential, give solid colors to flex children */
.stripe-bar { display: flex; }
.stripe-bar div { flex: 1; }
.red   { background: #FF6B6B; }
.teal  { background: #4ECDC4; }
```

**Why:** PowerPoint shape fills support solid and gradient fills, but pptxgenjs's `fill: { color: ... }` maps only to solid fills. Native PowerPoint gradients require a separate structure that this toolchain does not currently support.

### Rule 3: Backgrounds, Borders, and Shadows Belong on DIVs, Not Text Elements

```html
<!-- ❌ Wrong: background color on <p> -->
<p style="background: #FFD700; border-radius: 4px;">Key content</p>

<!-- ✅ Correct: outer div owns background/border; <p> owns text only -->
<div style="background: #FFD700; border-radius: 4px; padding: 8pt 12pt;">
  <p>Key content</p>
</div>
```

**Why:** in PowerPoint, a shape such as a rectangle and its text frame are separate objects. An HTML `<p>` translates only into a text frame. Background, border, and shadow belong to a shape and therefore must be placed on the **div that wraps the text**.

### Rule 4: A DIV Cannot Use `background-image`—Use an `<img>` Element

```html
<!-- ❌ Wrong -->
<div style="background-image: url('chart.png')"></div>

<!-- ✅ Correct -->
<img src="chart.png" style="position: absolute; left: 50%; top: 20%; width: 300pt; height: 200pt;" />
```

**Why:** `html2pptx.js` extracts image paths only from `<img>` elements; it does not parse CSS `background-image` URLs.

---

## Merging Text Boxes with `data-pptx-merge`

**Default behavior:** every `<p>` or `<h1>`–`<h6>` becomes an **independent text box** in the PPTX. Three `<p>` elements inside a card become three stacked text boxes. During editing, users cannot insert a paragraph break and continue; they must change font size and alignment separately for each box.

**Solution:** add `data-pptx-merge="true"` to the outer div. Every `<p>` and heading inside that container is merged into **one editable text box**, separated by paragraph marks and continuously editable in PowerPoint.

```html
<!-- ✅ Merged: all four paragraphs become one text box -->
<div class="card" data-pptx-merge="true"
     style="position: absolute; top: 60pt; left: 60pt; width: 420pt;
            background: #1A4A8A; border-radius: 8pt; padding: 20pt 24pt;">
  <h2 style="font-size: 24pt; color: #FFFFFF;">Title</h2>
  <p  style="font-size: 14pt; color: #DDEEFF;">First body paragraph.</p>
  <p  style="font-size: 14pt; color: #FFD166;">Second paragraph: use a color change for emphasis.</p>
  <p  style="font-size: 14pt; color: #DDEEFF;">Third paragraph: continues in the same text box.</p>
</div>
```

**Styles preserved** as per-paragraph run options: `font-size`, `color`, `font-family`, `font-weight` (bold), `font-style` (italic), `text-decoration: underline`, and inline styling in `<b>`, `<i>`, `<u>`, `<strong>`, `<em>`, and `<span>`.

**Taken from the first paragraph and shared by the whole box:** `text-align` and `line-height`. PowerPoint alignment and line spacing operate at the paragraph/text-box level, so one merged box can use only one alignment. If paragraphs need different alignments, do not merge them.

The container's own `background`, `border`, `box-shadow`, and `border-radius` still render normally as a shape. A blue card and its text remain two layers—shape + text frame—but the text layer collapses from three or four boxes into one.

**Limitations:**
- `data-pptx-merge` cannot be nested; nesting causes an error.
- The container cannot use `background-image`, per hard constraint 4.
- Do not place child divs with their own `background` or `border` inside the container. They still render as independent shapes, while their text is moved into the merged box, which may cause visual misalignment.

**When to use it:** content that will be revised repeatedly or edited further in PowerPoint. It is unnecessary for a one-time archival export; either version renders the same.

---

## Path A HTML Template Skeleton

Use one independent HTML file per slide so scopes remain isolated and CSS from a single-file deck cannot leak between slides.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 960pt; height: 540pt;           /* ⚠️ Must match LAYOUT_WIDE */
    font-family: system-ui, -apple-system, sans-serif;
    background: #FEFEF9;                    /* Solid color; gradients are forbidden */
    overflow: hidden;
  }
  /* DIV owns layout, background, and border */
  .card {
    position: absolute;
    background: #1A4A8A;                    /* Background belongs on the DIV */
    border-radius: 4pt;
    padding: 12pt 16pt;
  }
  /* Text elements own typography only; never background or border */
  .card h2 { font-size: 24pt; color: #FFFFFF; font-weight: 700; }
  .card p  { font-size: 14pt; color: rgba(255,255,255,0.85); }
</style>
</head>
<body>

  <!-- Title area: outer div positions; inner elements hold text -->
  <div style="position: absolute; top: 40pt; left: 60pt; right: 60pt;">
    <h1 style="font-size: 36pt; color: #1A1A1A; font-weight: 700;">Use an assertive sentence as the title, not a topic label</h1>
    <p style="font-size: 16pt; color: #555555; margin-top: 10pt;">The subtitle adds supporting context</p>
  </div>

  <!-- Content card: div owns background; h2/p own text -->
  <div class="card" style="top: 130pt; left: 60pt; width: 240pt; height: 160pt;">
    <h2>Key Point One</h2>
    <p>Short supporting text</p>
  </div>

  <!-- List: use ul/li rather than manually typed bullet characters -->
  <div style="position: absolute; top: 320pt; left: 60pt; width: 540pt;">
    <ul style="font-size: 16pt; color: #1A1A1A; padding-left: 24pt; list-style: disc;">
      <li>First key point</li>
      <li>Second key point</li>
      <li>Third key point</li>
    </ul>
  </div>

  <!-- Illustration: use <img>, not background-image -->
  <img src="illustration.png" style="position: absolute; right: 60pt; top: 110pt; width: 320pt; height: 240pt;" />

</body>
</html>
```

---

## Common Error Cheatsheet

| Error | Cause | Fix |
|---|---|---|
| `DIV element contains unwrapped text "XXX"` | Bare text inside a div | Wrap it in `<p>` or `<h1>`–`<h6>` |
| `CSS gradients are not supported` | Uses `linear-gradient` or `radial-gradient` | Replace with a solid color or segmented flex children |
| `Text element <p> has background` | Background color applied to `<p>` | Wrap it in a `<div>` that owns the background; keep `<p>` text-only |
| `Background images on DIV elements are not supported` | Div uses `background-image` | Replace with an `<img>` element |
| `HTML content overflows body by Xpt vertically` | Content extends beyond 540 pt | Reduce content, reduce type size, or truncate with `overflow: hidden` |
| `HTML dimensions don't match presentation layout` | Body size and presentation layout disagree | Use a `960pt × 540pt` body with `LAYOUT_WIDE`, or define a custom layout |
| `Text box "XXX" ends too close to bottom edge` | Large `<p>` sits less than 0.5 inch from the body bottom | Move it upward and leave sufficient bottom margin; projection often obscures part of the slide bottom |

---

## Basic Workflow: PPTX in Three Steps

### Step 1: Write One Constraint-Compliant HTML File per Slide

```
my-deck/
├── slides/
│   ├── 01-cover.html    # Every file is a complete 960 × 540 pt HTML document
│   ├── 02-agenda.html
│   └── ...
└── illustration/        # Every image referenced by <img>
    ├── chart1.png
    └── ...
```

### Step 2: Write `build.js` to Call `html2pptx.js`

```js
const pptxgen = require('pptxgenjs');
const html2pptx = require('../scripts/html2pptx.js');  // Script from this skill

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';  // 13.333 × 7.5 inches, matching 960 × 540 pt HTML

  const slides = ['01-cover.html', '02-agenda.html', '03-content.html'];
  for (const file of slides) {
    await html2pptx(`./slides/${file}`, pres);
  }

  await pres.writeFile({ fileName: 'deck.pptx' });
})();
```

### Step 3: Open and Inspect

- Open the exported PPTX in PowerPoint or Keynote.
- Double-click any text. It should be directly editable; if it is an image, rule 1 was violated.
- Check overflow: every slide should remain within the body with no cropping.

---

## This Path vs. Other Options

| Requirement | Choose |
|---|---|
| Colleagues will edit text in the PPTX, or nontechnical users will continue editing | **This path**: editable; HTML must follow the four constraints from the beginning |
| Presentation or archive only; no further editing | `export_deck_pdf.mjs` for multiple files, or `export_deck_stage_pdf.mjs` for a single-file deck stage; both create vector PDF |
| Visual freedom has priority—animation, web components, CSS gradients, complex SVG—and editability is unnecessary | **PDF**, as above. PDF preserves fidelity and works cross-platform; it is more appropriate than an image-based PPTX. |

**Never force visually unconstrained finished HTML through `html2pptx`.** Measured pass rate for visual-first HTML is below 30%; retrofitting the remaining slides takes longer than rebuilding them. Export PDF instead of forcing PPTX.

---

## Fallback: A Visual Design Already Exists, but the User Insists on Editable PPTX

This occasionally happens: you or the user has completed visually driven HTML using gradients, web components, and complex SVG. PDF is the natural output, but the user explicitly says, “No, it must be an editable PPTX.”

**Do not force it through `html2pptx` and hope it passes.** Visual-first HTML has a measured pass rate below 30%; the other 70% errors or renders incorrectly. Use this fallback instead.

### Step 1 · Explain the Limitations First

State three things clearly:

> “Your current HTML uses [list specifics: gradients / web components / complex SVG / ...]. Direct conversion to editable PPTX will fail. I can offer two options:
> - A. **Export PDF** (recommended)—preserves 100% of the visual design; recipients can view and print but cannot edit text.
> - B. **Rewrite an editable HTML version from the visual design**—retain the color, layout, copy, and design decisions, but reorganize the HTML under the four hard constraints, **sacrificing** gradients, web components, complex SVG, and related visual capabilities—then export editable PPTX.
>
> Which do you prefer?”

Do not present option B as trivial. State **exactly what will be lost** and let the user choose.

### Step 2 · If the User Chooses B, the AI Rewrites It—Do Not Ask the User To

The doctrine is: **the user provides design intent; you translate it into a compliant implementation**. Do not make the user learn the four constraints and rewrite the file themselves.

During the rewrite:
- **Preserve:** color system—primary, secondary, neutral; information hierarchy—title, subtitle, body, annotation; core copy; layout skeleton—vertical bands, columns, or grid; and slide rhythm.
- **Degrade gracefully:** CSS gradient → solid color or segmented flex blocks; web component → paragraph-level HTML; complex SVG → simplified `<img>` or solid geometry; shadow → remove or reduce to extremely subtle; custom font → nearest system font.
- **Rewrite:** bare text → `<p>` / heading; `background-image` → `<img>`; background or border on `<p>` → wrapping div.

### Step 3 · Provide a Comparison List

After the rewrite, give the user a before/after list explaining which details were simplified:

```
Original design → editable-version adjustment
- Purple gradient in the title area → solid primary #5B3DE8 background
- Data-card shadows → removed; cards separated with 2 pt outlines
- Complex SVG line chart → simplified to <img> PNG generated from an HTML capture
- Web-component hero animation → static first frame; web components cannot be translated
```

### Step 4 · Export and Deliver Both Formats

- Run `scripts/export_deck_pptx.mjs` on the editable HTML to create the editable PPTX.
- **Also preserve the original visual design** and run `scripts/export_deck_pdf.mjs` to create a high-fidelity PDF.
- Deliver both: visual-design PDF + editable PPTX, each serving its proper purpose.

### When to Refuse Option B Outright

In some cases the rewrite cost is too high, and you should advise against editable PPTX:
- Animation or interaction is the HTML's core value; rewriting leaves only a static first frame and loses more than 50% of the information.
- More than 30 slides; rewrite cost exceeds two hours.
- The visual design depends deeply on precise SVG or custom filters; the rewrite would barely resemble the original.

Tell the user: “The cost of rewriting this deck is too high. I recommend PDF instead of PPTX. If the recipient absolutely requires a `.pptx`, the design must become substantially plainer. Would you prefer PDF?”

---

## Why the Four Constraints Are Physical Constraints, Not Bugs

These four rules are not laziness by the author of `html2pptx.js`. They are **constraints of PowerPoint's OOXML file format itself**, projected onto HTML:

- PPTX text must live in a text frame (`<a:txBody>`), corresponding to paragraph-level HTML.
- A PPTX shape and text frame are two objects; a single element cannot simultaneously draw a background and hold text.
- PPTX shape fills have limited gradient support—only certain preset gradients, not arbitrary CSS angles.
- A PPTX picture object must reference a real image file rather than a CSS property.

Once this is understood, **do not wait for the tool to become “smarter.”** Adapt the HTML structure to the PPTX format, not the reverse.
