# Typography · A Reasoning System

> **This is not a font list. It is a set of reasoning rules for type pairing and typography.** `design-styles.md` names fonts for 40 styles; this document explains why those pairings work and how to derive type size, line length, and weight from any content. The goal is to produce typography appropriate to each use case—even under the same style label—instead of copying the same scale every time.
>
> The prerequisite still applies: when a design context exists, lift the user's existing fonts first (see `design-context.md`). Use this document only when the user has no type specification.

## 0. Typography decision sequence

Work through these decisions in order. Each step depends on the one before it; do not jump straight to “choose a good-looking font”:

1. **Content type** → long-form reading / data-dense / large marketing type / UI; determines the modular-scale ratio and body size
2. **Language mix** → Chinese only / mixed Chinese and Latin / Latin only; determines the fallback chain and baseline line-height
3. **Style temperature** (aligned with `design-styles.md`: quiet / neutral / bold) → determines the source of contrast in the pairing
4. **Font name comes last** → choose from the pairing table in §3 or from the corresponding style-library entry

Why: if you choose the font name first, the content has no influence on the typography. That is the root cause of generic, one-size-fits-all results.

## 1. Font size scale (modular scale)

Do not choose type sizes by instinct. Derive each step by multiplying the body size by a fixed ratio. That ratio determines the page's dramatic intensity:

| Proportion | Name | Personality | Applicability |
|------|------|------|------|
| 1.2 | Minor third | Gentle; supports many levels without noise | Dashboards, documentation sites, information-dense UI |
| 1.25 | Major third | Versatile and safe | Most websites and product landing pages |
| 1.333 | Perfect fourth | Titles stand out clearly | Editorial long-form, marketing pages, reports |
| 1.5 | Perfect fifth | Dramatic, with very few levels | Type-led posters, slides, one-line-per-screen heroes |

**Derivation rule**: Set body text at 16–18px (17–18px for Chinese, whose dense strokes feel more crowded than Latin text at the same nominal size). Scale headings upward and captions downward from that base. More than five levels is a loss of control—remove one.

| Level | Reference value at 1.25 scale | Purpose |
|------|--------------------|------|
| caption | 12–13px | Legends, metadata, EXIF-style labels |
| small | 14px | Supporting instructions and tables |
| body | 16–18px | Body copy; the baseline for the scale |
| h3 | ≈1.25x | Section title |
| h2 | ≈1.56x | Chapter title |
| h1 | ≈1.95x | Page title |
| display | 3×–8×, intentionally outside the scale | Hero-size type, determined by composition rather than the modular scale |

**Fluid type sizing** (required for display text so it neither feels rigid on large screens nor overflows on small ones):

```css
/* clamp(minimum, preferred, maximum): preferred = base rem + viewport coefficient */
h1 { font-size: clamp(2rem, 1.2rem + 3.5vw, 4.5rem); }
.display { font-size: clamp(3rem, 1rem + 9vw, 9rem); }
/* Body text should vary only within a narrow range, such as 16→18px. */
body { font-size: clamp(1rem, 0.95rem + 0.3vw, 1.125rem); }
```

Why display type sits outside the scale: giant hero text is a compositional element, not another semantic heading level. Its size depends on how much of the viewport it should occupy, so deriving it from `vw` is more appropriate than extending the modular scale.

## 2. Line length and line height

### Line length (a stronger influence on readability than font choice)

| Language | Comfort zone | CSS implementation |
|------|--------|----------|
| Latin-script body text | 45–75 characters; optimum about 66 | `max-width: 65ch` |
| Chinese body text | 22–38 characters per line; optimum 28–32 | `max-width: 36em` (`em` scales with type size) |
| Captions/sidebar | Shorter; 15–20 Chinese characters | Constrained naturally by the narrow container |

Why Chinese lines are shorter: Han characters are dense, square forms with no word spaces, so the same width carries substantially more information than Latin text. Readers take in more content with the same number of saccades; when a line grows too long, finding the start of the next line becomes difficult.

### Line height should track line length

Line height is not a constant; it is a function of line length. The longer the line, the farther the eye must travel on return, and the more vertical spacing it needs as a guide:

| Context | Latin script | Chinese |
|------|------|------|
| Large display type (1–2 lines) | 0.95–1.1 | 1.1–1.25 |
| Headings (h1–h3) | 1.1–1.3 | 1.3–1.4 |
| Short lines (<30 Latin words per line) | 1.4–1.5 | 1.6–1.7 |
| Long lines near the upper measure limit | 1.6 | 1.8–2.0 |

Chinese generally needs about 0.2 more line height than Latin text. Han characters fill the em square and lack the natural gaps between Latin lowercase forms; insufficient leading makes adjacent lines merge visually.

### `text-wrap` (free typographic quality in modern browsers)

```css
h1, h2, h3 { text-wrap: balance; }  /* Balance multiline headings and eliminate orphaned last lines. */
p { text-wrap: pretty; }            /* Avoid orphaned words; strongest for Latin text, subtler for Chinese. */
```

Use `balance` only for headings of four lines or fewer (the algorithm is capped at six lines and has a performance cost). Applying `pretty` globally to body text is safe.

## 3. Ten open-source font pairings for Latin script

Font pairings draw contrast from three sources. Decide which one you need before choosing the faces:

- **Formal contrast**: serif display × sans-serif body (the classic approach, but their x-heights must mesh or the apparent type size will jump)
- **Same-family fit**: a superfamily with one shared design skeleton (very low risk, at the cost of some blandness)
- **Period contrast**: classical forms × modern forms (a lineage gap of 200+ years creates tension; a 50-year gap often just looks inconsistent)

| # | Pairing (display + body) | Pairing logic | Temperature | Acquisition |
|---|------------------------|----------|------|------|
| 1 | Newsreader + Geist | Formal contrast: a screen-optimized transitional serif with a high x-height that aligns cleanly with Geist; **a credible alternative to the overused Fraunces** | Quiet | Google Fonts / official Vercel repository |
| 2 | Source Serif 4 + Source Sans 3 | Same-family fit: both belong to Adobe's design system, so cap height and weight rhythm align; exceptionally reliable for reports and documentation | Quiet | Google Fonts |
| 3 | EB Garamond + IBM Plex Sans | Period contrast: a 16th-century French old-style serif × a rational 2017 grotesque, producing 400 years of tension. Garamond's x-height is low, so inline mixing needs size compensation (+8% is a practical starting point; use `font-size-adjust` for the systematic solution in §4) | Quiet · Literary | Google Fonts |
| 4 | Lora + Hanken Grotesk | Formal contrast: Lora's brush-inflected serif has moderate contrast and remains sturdy on screen; Hanken is an open-source relative of Söhne in tone | Neutral | Google Fonts |
| 5 | Instrument Serif + Geist | Formal contrast: Instrument Serif offers only weight 400 and is therefore inherently display-only; body copy belongs in Geist. ⚠️ AI tools are rapidly overusing it, so in 2026 it is a poor choice when the goal is to look distinctive | Neutral | Google Fonts |
| 6 | Schibsted Grotesk + Source Serif 4 | Reversed roles: grotesque display type with serif body copy creates an editorial-media tone. **A strong alternative to overused Space Grotesk**; Schibsted was commissioned by the Norwegian media group and carries genuine newsroom lineage | Neutral | Google Fonts |
| 7 | Bricolage Grotesque + Newsreader | Formal contrast: Bricolage's ink traps and irregularities emerge only at large sizes, making it a natural display face; quiet Newsreader body text creates a rugged × elegant tension | Bold | Google Fonts |
| 8 | Archivo (Expanded/Black) + Inter | Poster structure: wide, heavy Archivo dominates the field; Inter works only as the 14–16px body-text workhorse—its proper role here; see the anti-patterns below | Bold | Google Fonts |
| 9 | Cormorant Garamond + Work Sans | High-contrast luxury: Cormorant's hairlines are extremely fine, so it **must be set at 40px or larger**; smaller sizes lose strokes. Suitable for fashion and space-catalog aesthetics | Bold | Google Fonts |
| 10 | Geist Mono / JetBrains Mono + Geist | Monospace as the protagonist: evokes terminals and engineering. Restrict monospace to labels, numerals, and code; setting whole paragraphs in it is disastrous and expands line length by about 30% | Neutral · Technical | Official Vercel / JetBrains repositories, both OFL |

**Overused list** (these have become fingerprints of AI-generated pages):

| Overused choice | Why | Alternatives |
|--------|----------|------|
| Fraunces as display type | The default “tasteful” choice in nearly every AI design tool from 2023–2025 | Newsreader, Libre Caslon Text |
| Inter as display type | Inter was designed for small UI text; at large sizes it is uniform and expressionless | Archivo, Anton, Schibsted Grotesk |
| Space Grotesk | The lazy shorthand for “technical,” now ubiquitous across crypto and AI landing pages | Schibsted Grotesk, Familjen Grotesk |
| Playfair Display | The lazy shorthand for “elegant,” with an unmistakable wedding-invitation feel | Cormorant for more drama, DM Serif Display for a friendlier tone |

## 4. Chinese typography (the most important section in this document)

Latin-script typography has a mature toolchain built over centuries; Chinese typography does not enjoy the same level of tooling. AI design tools handle Chinese particularly poorly, often falling back to system fonts and applying Latin rules unchanged. This is a major opportunity for differentiation.

### 4.1 Open-source and free-for-commercial-use Chinese fonts

| Font | Category | Temperament | Temperature | Acquisition |
|------|------|------|------|------|
| Noto Serif SC | Song / serif | Publishing standard; seven complete weights, with Heavy suitable for display use | Quiet–neutral | Google Fonts, OFL |
| Noto Sans SC | Hei / sans | The Chinese counterpart to Inter: reliable and neutral; safe for body text, but deliberately low in personality | All-purpose fallback | Google Fonts, OFL |
| LXGW WenKai | Kai / regular script | Warm and handwritten; suitable for literary, educational, and personal-blog body text and quotations | Quiet · Warm | GitHub `lxgw/LxgwWenKai`, OFL |
| LXGW Neo XiHei | Hei / sans | A slimmer, more open screen sans than Noto Sans SC; comfortable for sustained reading | Quiet | GitHub `lxgw/LxgwNeoXiHei` |
| Smiley Sans | Oblique Hei / sans | **A rare native oblique in Chinese type**, energetic and intended for headings; tiring in body copy | Bold | GitHub `atelier-anchor/smiley-sans`, OFL |
| Huiwen-mincho | Old-form Mincho | Evokes letterpress printing and retro publishing; suitable for book covers and cultural display work | Neutral–bold · Retro | Maoqian.com/GitHub, free for commercial use |
| KingHwa OldSong | Old Song | A square, firm display Song with the authority of a newspaper masthead | Bold · Retro | Maoqian.com, free for commercial use |
| GenRyuMin / GenYoMin | Mincho (Traditional Chinese-oriented) | Recut from Noto Serif CJK, retaining traditional glyph details; preferred for Traditional Chinese | Quiet · Classical | GitHub `ButTaiwan`, OFL |
| Glow Sans | Geometric Hei / sans | A modern geometric sans derived from Noto Sans CJK, with multiple widths; Compressed works for tall, narrow displays | Neutral–bold · Modern | GitHub `welai/glow-sans`, OFL |
| MiSans / HarmonyOS Sans / OPPO Sans | Vendor UI sans | UI sans families with slightly more character than Noto Sans SC; suitable for app prototypes | Neutral | Vendor websites, free for commercial use |

Selection rule: **Choose body text only from Song, Hei, or Kai families**; the others are display faces and become tiring over a full paragraph. Reach for Smiley Sans, Old Song, or Mincho only when the display type needs a stronger personality. A single Chinese font can equal ten Latin fonts in file size (5–15 MB), so use no more than two Chinese families per page—for both loading performance and visual consistency.

### 4.2 Mixing Chinese and Latin script

**The fallback chain is the first lever**: Latin glyphs bundled with Chinese fonts are often weak (Noto Sans SC's Latin is particularly dull). Put the Latin font first so it handles Latin letters and numerals; Han characters will automatically fall through to the Chinese fonts later in the chain:

```css
/* Latin fonts first, then Chinese fonts, system CJK fallbacks, and finally the generic family. */
font-family: "Geist", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
/* The same rule applies to serif stacks. */
font-family: "Newsreader", "Noto Serif SC", "Songti SC", serif;
```

Why this order works: `font-family` resolves one character at a time. Latin fonts do not contain CJK code points, so Han characters naturally fall through to the Chinese font. Reverse the order and the Chinese font also captures its bundled Latin glyphs, preventing the carefully chosen Latin face from ever appearing.

**Type-size compensation**: Latin lowercase letters look smaller at the same nominal size because their x-height occupies only part of the em square, while Han characters fill it. Two solutions:

```css
/* Option 1: normalize fallback fonts by x-height with font-size-adjust (Chrome 127+/Firefox/Safari 17+). */
:root { font-size-adjust: from-font; }
/* Option 2: choose a Latin face with a high x-height (Geist, Inter, Source Sans) for natural alignment. */
```

**Baseline alignment**: When Chinese and Latin baselines clash, English words appear to sink inside a Chinese line. Prefer a Latin face with a higher x-height. In isolated display compositions, fine-tune the Latin span with `vertical-align: -0.02em` to `-0.06em`; do not do this throughout body copy, where the maintenance cost outweighs the benefit.

**Numerals**: Set numbers in the Latin font (the fallback chain already guarantees this). Data tables must use `font-variant-numeric: tabular-nums`; otherwise digits such as 1 and 8 have different widths and columns visibly shift.

**Do not insert spaces between Chinese and Latin text**: this is a repository-specific rule. Rely on the fallback fonts' built-in spacing rather than adding spaces manually.

### 4.3 Chinese typography has no native italic tradition

Chinese type has no native italic tradition. When a browser encounters `font-style: italic`, it mechanically slants the glyphs, distorting their strokes. Use one of these substitutes instead:

| Latin-script convention | Chinese substitute | CSS |
|----------|----------|-----|
| Italic emphasis | Change weight | `font-weight: 600`, provided the family includes a true 600 weight |
| Italic book title or citation | Add a background highlight | `background: linear-gradient(transparent 60%, #FFE9A8 60%)` |
| Italic quotation block | Change typeface | Set the quotation in LXGW WenKai, whose handwritten character already provides a distinct quotation voice |
| Italic proper name | Use color or an emphasis mark | `text-emphasis: dot`, a native CJK emphasis treatment |

Safety switch: set `font-synthesis: none;` globally to disable synthetic italic and bold. It is better to lose an emphasis treatment than accept distorted glyphs.

### 4.4 Punctuation rules

| Rule | Implementation | Why |
|------|------|--------|
| Quotation marks | Use corner brackets `「」` and `『』`, not curly quotation marks | Curly quotes occupy full-width CJK cells but retain Latin shapes, so they appear to float; corner brackets are a hard rule in this repository |
| Prohibited line starts and ends | `line-break: strict;` | Prevent commas from starting a line and opening quotation marks from ending one—a baseline requirement in Chinese typesetting |
| Hanging punctuation | `hanging-punctuation: first allow-end;` in Safari; for broader support, use `text-indent: -0.5em` on paragraphs that begin with an opening quote | Without hanging punctuation, an opening quote makes the first line appear indented by half a character and breaks the visual left edge |
| Consecutive punctuation compression | `font-feature-settings: "halt";` (end-of-line compression) or `"palt"` (proportional widths; requires letter-spacing) | Consecutive full-width marks such as `「）。」` create a gap about half a character wide; `halt` closes it |

### 4.5 Chinese tracking ranges

| Context | Range | Why |
|------|------|--------|
| Body text | 0 to 0.05em | A slight increase can add breathing room; beyond 0.05em, characters stop grouping naturally and reading slows |
| Heading (24–48px) | 0 | Han characters are naturally spaced as squares and do not need Latin-style tracking adjustments |
| Large display type (>60px) | -0.02em to 0 | Large glyphs make default gaps feel wider, so slight tightening improves cohesion; more negative tracking risks stroke collisions |
| Small all-caps Latin label | 0.08–0.15em | The only context that calls for generous positive tracking; apply it only to Latin capitals |

**Never apply the Latin “tighten display text to -0.05em” rule to Chinese**: Han characters fill the em square, so aggressive negative tracking makes their strokes collide.

### 4.6 Large Chinese display type

Chinese does not have the same Ultra Thin-to-Black display ecosystem as Latin type. Create drama in large Chinese text through deliberate decisions:

- **Weight contrast is the primary tool**: set Noto Serif SC Heavy 900 against Light 300. Two extreme weights from one family create more tension than switching families, with no extra loading cost
- **Stroke density determines the minimum usable size**: high-contrast Song faces with fine horizontal strokes work only at generous sizes. Below roughly 24px, the hairlines begin to break and the text needs a sturdier medium or bold cut.
- **The inverse is also true**: heavy Hei Black and Old Song faces carry too much ink at very large sizes, magnifying the density difference between a sparse character such as `一` and a complex one such as `灥`. For uneven titles, step down to a lighter weight.
- **Vertical setting is a uniquely powerful Chinese display tool**: `writing-mode: vertical-rl` creates spine-like titles, poems, and contents pages that Latin script cannot reproduce naturally. Set Latin letters and numerals inside vertical text with `text-orientation: upright` or `text-combine-upright: all` (to keep two-digit numbers upright as a unit)

## 4A. Russian and Cyrillic typography

Russian artifacts must use font files with verified Cyrillic glyph coverage rather than
relying on a late system-font fallback. Good starting families include Inter, IBM Plex
Sans, PT Sans, PT Serif, Noto Sans, and Noto Serif.

- Set `lang="ru"` on the document or relevant content container.
- Use `«…»` for primary quotation marks and `„…“` for nested quotations.
- Allow roughly 10–15% more horizontal space than an English placeholder of similar meaning.
- Use sentence case for long headings; reserve uppercase for short labels.
- Use `hyphens: auto` only in narrow text columns, never in display headings.
- Validate every line break with the final Russian copy before export.

## 5. Anti-pattern list

| ❌ Anti-pattern | Why it is wrong |
|-----------|----------|
| Inter everywhere (display and body) | Inter is designed for small UI text; at display sizes it is uniform and expressionless. This is the leading fingerprint of an AI-generated page |
| Leaving Chinese to the system's generic `sans-serif` | Windows may fall back to SimSun or Microsoft YaHei, while macOS uses PingFang. The page then has two completely different faces across platforms—effectively no type design at all |
| Faux italic or faux bold | Browser synthesis distorts Chinese glyphs: faux italic slants the structure, while faux bold fills counters and blurs strokes. Disable both with `font-synthesis: none` |
| Display tracking is too loose | Latin display type usually needs tightening because gaps expand at large sizes. AI often does the opposite and adds `+0.05em`, making headings feel like temporary placeholders |
| Uncontrolled line length (no `max-width`) | Sixty Chinese characters on one desktop line makes return sweeps difficult. Excessive measure is the most damaging readability failure—worse than choosing the wrong font |
| More than six type-size steps | Hierarchy loses value and readers cannot tell what matters. The point of a scale is to enforce restraint |
| Only two weights, 400 and 700 | Size must carry the entire hierarchy, making the page flat. Variable fonts make the full 300–900 range available as an expressive dimension |
| Tables and data omit `tabular-nums` | Unequal digit widths make columns shift and undermine the data's visual credibility |
| Using Chinese display faces such as Smiley Sans or Old Song for body text | Their strong personality becomes reading friction over a paragraph and grows tiring after roughly 200 characters |
| Putting the Chinese font first in a mixed-script fallback chain | Its bundled Latin glyphs capture every Latin character, so the carefully selected Latin family is never used |

## 6. CSS implementation essentials

```css
:root {
  /* 1. Fallback chain: Latin → Chinese → system CJK → generic. Order is the rule; see §4.2. */
  --font-body: "Geist", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-display: "Newsreader", "Noto Serif SC", "Songti SC", serif;

  /* 2. Disable browser-synthesized italic and bold; required for Chinese typography. */
  font-synthesis: none;

  /* 3. Minimum standard for Chinese line breaking. */
  line-break: strict;        /* Prevent prohibited punctuation at line starts and ends. */
  overflow-wrap: break-word; /* Keep long URLs and Latin strings inside the container. */
}

body {
  font-family: var(--font-body);
  font-size: 17px;           /* Chinese body-text baseline; see §1. */
  line-height: 1.8;          /* Chinese body-text line-height baseline; see §2. */
  /* Enable standard body-text ligatures and contextual alternates. */
  font-feature-settings: "liga" 1, "calt" 1;
}

/* Data: tabular numerals plus slashed zero to distinguish 0 from O. */
.data, table { font-variant-numeric: tabular-nums slashed-zero; }

/* Small Latin labels: all caps are the only valid use of generous positive tracking. */
.label { text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; }

/* Compress the gaps created by full-width punctuation in large Chinese display text. */
.display-cjk { font-feature-settings: "halt" 1; }
```

**Loading Chinese fonts** (a single file is 5–15 MB; loading full families can destroy first-screen performance):

- Prefer the Noto SC families on Google Fonts. They are already split into hundreds of `unicode-range` shards, so the browser downloads only the characters in use.
- Subset self-hosted display fonts such as LXGW or Smiley Sans before shipping. Use `cn-font-split` or fonttools' `pyftsubset`: subset body fonts to roughly 3,500 common characters and display fonts to the exact characters used. A poster may contain only 20 characters, allowing a subset below 50 KB.
- Always provide `font-display: swap`. Chinese fonts download slowly; a blank page waiting for type is the worst possible experience.
