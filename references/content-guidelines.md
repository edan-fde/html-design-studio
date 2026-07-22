# Content Guidelines: Anti-AI-Slop Rules, Content Principles, and Scale Standards

These are the easiest traps to fall into in AI-assisted design. A list of what **not** to do matters more than a list of what to do: AI slop is the default, and it appears unless you actively prevent it.

## Complete AI-Slop Blocklist

### Visual Traps

**❌ Aggressive gradient backgrounds**
- Full-screen purple → pink → blue gradients (the signature look of AI-generated websites)
- Rainbow gradients in any direction
- Mesh gradients covering the entire background
- ✅ If a gradient is necessary, make it subtle, monochromatic, and purposeful—for example, as a button-hover accent.

**❌ Rounded cards with a colored left-border accent**
```css
/* The signature AI-slop card */
.card {
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  padding: 16px;
}
```
This card style is everywhere in AI-generated dashboards. Need emphasis? Use a more considered device: background contrast, weight or size contrast, a plain divider, or no card boundary at all.

**❌ Decorative emoji**
Unless the brand itself uses emoji (Notion and Slack, for example), do not place emoji in the UI. **Especially avoid:**
- 🚀 ⚡️ ✨ 🎯 💡 before headings
- ✅ in feature lists
- → inside CTA buttons (a standalone typographic arrow is fine; an emoji arrow is not)

If you do not have an icon, use a real icon library such as Lucide, Heroicons, or Phosphor—or use a placeholder.

**❌ Drawing imagery in SVG**
Do not try to depict people, scenes, devices, objects, or abstract art in SVG. AI-drawn SVG imagery is immediately recognizable as AI output: childish and cheap. **A gray rectangle labeled “Illustration placeholder · 1200 × 800” is one hundred times better than a clumsy SVG hero illustration.**

The only appropriate uses of SVG here are:
- Real icons at roughly 16 × 16 to 32 × 32
- Decorative geometric forms
- Data-visualization charts

**❌ Excessive iconography**
Not every heading, feature, or section needs an icon. Overusing icons makes an interface feel like a toy. Less is more.

**❌ “Data slop”**
Invented statistics used as decoration:
- “10,000+ happy customers” when you do not know whether they exist
- “99.9% uptime” without real data
- Decorative “metric cards” made from an icon, a number, and a word
- Mock tables filled with extravagantly styled fake data

If real data is unavailable, leave a placeholder or ask the user for it.

**❌ “Quote slop”**
Do not invent user reviews or famous quotations as page decoration. Leave a placeholder and ask the user for a genuine quote.

### Typography Traps

**❌ Avoid these overused fonts:**
- Inter (the default AI-generated website font)
- Roboto
- Arial / Helvetica
- A pure system-font stack
- Fraunces (AI discovered it and then overused it)
- Space Grotesk (the latest AI favorite)

**✅ Pair a distinctive display face with a body face.** Directions to explore:
- Serif display + sans-serif body for an editorial feel
- Monospace display + sans-serif body for a technical feel
- Heavy display + light body for contrast
- A variable font whose weight animates in the hero

Font resources:
- Less obvious Google Fonts choices such as Instrument Serif, Cormorant, Bricolage Grotesque, and JetBrains Mono
- Open-source font libraries and alternatives related to well-known families
- Never invent a font name

### Color Traps

**❌ Inventing colors from thin air**
Do not design an unfamiliar full palette from scratch. The result is usually discordant.

**✅ Strategy:**
1. Brand colors exist → use them; derive missing color tokens through OKLCH interpolation.
2. No brand palette, but references exist → sample colors from the reference product screenshots.
3. Starting with nothing → select a known color system such as Radix Colors, Tailwind's default palette, or Anthropic's brand palette; do not improvise one.

Defining colors in **OKLCH** is the modern approach:
```css
:root {
  --primary: oklch(0.65 0.18 25);       /* warm terracotta */
  --primary-light: oklch(0.85 0.08 25); /* lighter shade in the same family */
  --primary-dark: oklch(0.45 0.20 25);  /* darker shade in the same family */
}
```
OKLCH preserves hue while lightness changes, making it easier to use than HSL.

**❌ Adding dark mode by casually inverting colors**
Dark mode is not a simple inversion. Good dark themes require deliberate changes to saturation, contrast, and accent colors. If you are not prepared to design dark mode properly, omit it.

### Layout Traps

**❌ Bento-grid overuse**
Every AI-generated landing page wants a bento grid. Use one only when the information structure genuinely calls for it; otherwise choose another layout.

**❌ Large hero + three-column features + testimonials + CTA**
This landing-page template is exhausted. If the work calls for innovation, actually innovate.

**❌ Every card in a grid having the same dimensions**
Use asymmetry: cards of different sizes, some with images and some text-only, with selected cards spanning columns. That looks designed rather than generated.

## Content Principles

### 1. Do Not Add Filler Content

Every element must earn its place. Empty space is a **composition** problem—solve it with contrast, rhythm, and negative space, not by filling it with content.

**Questions that expose filler:**
- Would the design become worse if this content disappeared? If not, remove it.
- What real problem does this element solve? If the answer is “it makes the page feel less empty,” remove it.
- Is this statistic, quote, or feature supported by real information? If not, do not invent it.

“One thousand noes for every yes.”

### 2. Ask Before Adding Material

Think an extra paragraph, page, or section would improve the work? Ask the user first; do not add it unilaterally.

Why:
- The user understands their audience better than you do.
- Additional content has a cost, and the user may not want it.
- Adding content unilaterally violates the relationship in which a junior designer reports back to the person directing the work.

### 3. Establish a System Up Front

After exploring the design context, **state the system you intend to use in words** and let the user confirm it:

```markdown
My design system:
- Color: #1A1A1A foreground + #F0EEE6 background + #D97757 accent (from your brand)
- Type: Instrument Serif for display text + Geist Sans for body text
- Rhythm: full-bleed color background with white type for section titles; white background for regular sections
- Imagery: a full-bleed hero photograph; placeholders in the feature section until you provide assets
- No more than two background colors, to avoid visual clutter

Confirm this direction and I’ll start building.
```

Start production only after the user confirms. This check-in prevents reaching the halfway point only to discover that the direction is wrong.

## Scale Standards

### Slides (1920 × 1080)

- Body text: **24 px minimum**, ideally 28–36 px
- Titles: 60–120 px
- Section titles: 80–160 px
- Hero headlines may be 180–240 px
- Never place text smaller than 24 px on a slide

### Printed Documents

- Body text: **10 pt minimum** (≈13.3 px), ideally 11–12 pt
- Titles: 18–36 pt
- Captions: 8–9 pt

### Web and Mobile

- Body text: **14 px minimum** (use 16 px for older audiences)
- Mobile body text: **16 px** (prevents automatic zoom on iOS)
- Minimum hit target for interactive elements: **44 × 44 px**
- Line height: 1.5–1.7 (1.7–1.8 for Chinese text)

### Contrast

- Body text against its background: **at least 4.5:1** (WCAG AA)
- Large text against its background: **at least 3:1**
- Check with the accessibility tools in Chrome DevTools

## Powerful CSS Features

**Advanced CSS features** are a designer's ally. Use them confidently.

### Typography

```css
/* Balance heading wraps so the final line is not left with a single word */
h1, h2, h3 { text-wrap: balance; }

/* Improve body-text wrapping and reduce widows and orphans */
p { text-wrap: pretty; }

/* Powerful tools for Chinese typography: punctuation compression and edge control */
p {
  text-spacing-trim: space-all;
  hanging-punctuation: first;
}
```

### Layout

```css
/* CSS Grid + named areas = exceptional readability */
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
}

/* Align content across cards with subgrid */
.card { display: grid; grid-template-rows: subgrid; }
```

### Visual Effects

```css
/* A more considered scrollbar */
* { scrollbar-width: thin; scrollbar-color: #666 transparent; }

/* Glassmorphism—use sparingly */
.glass {
  backdrop-filter: blur(20px) saturate(150%);
  background: color-mix(in oklch, white 70%, transparent);
}

/* Smooth page changes with the View Transitions API */
@view-transition { navigation: auto; }
```

### Interaction

```css
/* The :has() selector makes conditional styles easy */
.card:has(img) { padding-top: 0; } /* Cards with images have no top padding */

/* Container queries make components genuinely responsive */
@container (min-width: 500px) { ... }

/* The new color-mix() function */
.button:hover {
  background: color-mix(in oklch, var(--primary) 85%, black);
}
```

## Decision Cheatsheet: When You Hesitate

- Thinking of adding a gradient? → Probably do not.
- Thinking of adding an emoji? → Do not.
- Thinking of giving a card rounded corners plus a left-border accent? → Do not; find another approach.
- Thinking of drawing a hero illustration in SVG? → Do not; use a placeholder.
- Thinking of adding a decorative quote? → First ask whether the user has a genuine quote.
- Thinking of adding a row of icon-based features? → First ask whether icons are needed; they may not be.
- Using Inter? → Choose a more distinctive face.
- Using a purple gradient? → Replace it with a palette grounded in actual context.

**When you catch yourself thinking, “Adding this will make it look better,” that is often a sign of AI slop.** Build the simplest version first, and add only what the user asks for.
