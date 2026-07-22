# Design Style Library: 20 Web Styles + 20 PPT Styles (HTML-Native First)

> **Rebuilt in 2026-06.** This library was reverse-engineered from research into 10 major website categories and 10 major presentation categories, using the five most widely recognized examples in each category—100 real-world cases in total.
> The fatal flaw in the old library of 20 "graphic and installation designer philosophies" was that nearly every bold style depended on AI-generated imagery—particles, cinematic lighting, or hand-drawn art. **When image generation is unavailable and the default path is entirely HTML, the bold end of the field disappears and only minimalism remains. That is the root cause of generic default output.** Every style in this library therefore includes a **fidelity rating** for an implementation made solely with HTML/CSS and no generated imagery.
>
> ⚖️ **Remember what this library is for:** it is **a source of ideas when you have no direction, not a menu that every design must use**. If the user supplies content, a brand, or references, let the design grow from those inputs instead of imposing a library style. The skill's job is to help the user avoid the worst outcomes, not to prescribe what good design must look like. Good design grows from the user's real needs.

## How to Use This Library

1. **Choose the correct half by output type:** for a website, landing page, or official site, use the 20 web styles; for a PPT, deck, or presentation, use the 20 PPT styles.
2. **Temperature system:** every style is labeled `bold / neutral / quiet`. **Bold is deliberately the largest group**—9 of 20 web styles and 8 of 20 PPT styles. A model's deterministic bias naturally pulls it toward quiet minimalism, so the library's proportions must push in the opposite direction.
   - Choose Direction A, the dependable foundation, from the quiet or neutral styles according to the brief. Give Direction B a different temperature to create contrast. **Direction C is selected by the SKILL's seconds-based roulette; its temperature follows the selected entry.** The library's weighting increases the chance of a bold result without falsifying the roulette outcome.
   - ❌ Do not let all three directions collapse into "off-white + whitespace + one accent color." That is the most common failure mode.
3. **Fidelity:** at ≥90%, proceed with confidence. At 70–89%, the core is achievable, but the output must **state exactly which material details were reduced**—for example, the Memphis entry's distressed texture at 72%. Below 70%, do not recommend the style on the default HTML path unless the user explicitly accepts a severe reduction.
4. **Typefaces:** every style lists open-source alternatives, such as Inter, Geist, Manrope, Newsreader, Source Serif, and Schibsted Grotesk. Do not specify paid typefaces such as Söhne or Circular.
5. Integration: Phases 3–5 of the SKILL's Design Direction Advisor use this library to propose three directions; `assets/showcases/` contains a gallery of ready-made screenshots.

---

## Color-Derivation Protocol (Complete These Three Steps Before Using Any Style)

> ⚠️ **Every hex value in the style entries below is an illustrative anchor, not a formula.** When the same style is applied to different content, derive different colors through this protocol. Copying an entry's hex values directly merely produces more polished slop. A fixed formula gives 100 users 100 outputs in the same colors, reducing the palette's information value to zero. Derivation turns color into evidence that the design belongs uniquely to this content.
>
> **The same principle applies to type:** typeface names in the entries are illustrative anchors. After selecting a style, validate the display-and-body pairing against the pairing logic and overused-typeface list in `references/typography.md`. **When that list conflicts with an entry here, `typography.md` takes precedence.** For example, if an entry names Fraunces, replace it with an alternative such as Newsreader as directed by the list.

### Three Steps: Sample → Converge → Justify

| Step | What to do | Why |
|------|--------|--------|
| **1. Sample** | Draw the primary color from one of three sources rather than inventing it: ① brand assets—sample directly from the logo or existing visual identity; ② real content imagery—use dominant colors from product screenshots or photography; ③ cultural context—use the color associations inherent to the subject, as shown below. | Choosing a color from nowhere is a lottery drawn from the model's priors, which always returns the same fashionable colors. A color sampled from the content already carries its own reason for being there. |
| **2. Converge** | Use OKLCH to reduce the palette to **2–3 chromatic colors plus one neutral scale**. Express the neutrals as a lightness sequence, such as L 0.15/0.35/0.65/0.92/0.98. Separate chromatic colors by an OKLCH hue angle of H ≥60° or a lightness difference of L ≥0.3. | Too many colors inevitably create disorder. OKLCH's L channel is perceptually uniform, so a written lightness sequence becomes a hierarchy system that is easier to reason about than a pile of isolated hex values. |
| **3. Justify** | State in one sentence why these colors are right, and include the rationale in a code comment or delivery note. Example: "The primary color comes from the ochre in the user's logo, with chroma reduced to 0.08 to simulate ink." | **If you cannot write this sentence, you are copying a formula.** The rationale is a self-check against slop, not a ritual. |

Color derivation never overrides readability. After convergence, verify body-text contrast of at least 4.5:1; if it fails, adjust OKLCH lightness while preserving the sampled hue and the written rationale.

### Print-Like Color: Why Lower Saturation Feels More Refined Than Pure Screen Color

Ink on paper can never reach the maximum saturation of screen RGB. The narrower CMYK gamut, the paper's ink absorption, and reflected ambient light all mute the color. The sense of refinement that decades of print have trained into the human eye is, in essence, a memory of that physical grayness. Deliberately reducing chroma on screen borrows the remembered material quality of print.

| Use | OKLCH chroma reference | Effect |
|------|------------------|------|
| Large background areas | 0.01–0.04 | Paper-like and easy on the eye |
| Primary brand color / emphasis | 0.08–0.15 | Ink-like; conspicuous without looking plastic |
| Small accents—buttons or links | 0.15–0.22 | Preserves energy; use only in small areas |
| Full-bleed coverage above 0.25 | Use with caution | Creates a fluorescent screen-native effect suited only to intentionally digital styles such as Wrapped or Candy |

### Cultural-Context Quick Reference: One Hue, Different Meanings

Choosing a color is not merely choosing a hue; it is choosing the cultural coordinates behind that hue. Two reds can land worlds apart:

| Hue | Context A | Context B | What changes |
|------|--------|--------|--------|
| Red | Forbidden City vermilion—orange-leaning and gray, with low L and low C in OKLCH; darker and murkier than Coca-Cola red—signals tradition and solemnity | Coca-Cola red—a highly saturated true red—signals consumption and excitement | Lowering chroma moves the color from a retail shelf to a palace wall |
| Blue | Japanese indigo / ruri-kon—deep, violet-leaning, and gray—signals craft and stillness | Technology blue in the #0066FF family signals SaaS and efficiency | The latter is the model's favorite default blue; before using it, ask whether you are simply drawing from a lottery |
| Green | Matcha or moss green—yellow-leaning and low-saturation—signals nature and Japanese aesthetics | Fluorescent green #39FF14 signals terminals and hackers | Both are green, but one drinks tea while the other writes code |
| Yellow | Gamboge or mustard—brown-gray undertones—signals vintage print | Warning yellow or Mailchimp yellow signals visibility and playfulness | The amount of gray determines whether it feels like an old book page or a hard hat |
| White | Cream paper white #F5F0E8 signals warm publishing | Pure white #FFF signals a laboratory or Swiss modernism | A 2% shift in background color temperature separates the two personalities |

---

## Web Style Library (20 Styles)

#### Bold

**Editorial-Grade Brutalism (Giant Helvetica over Small Body Copy)** `Bold · 98% fidelity`
- References: Bloomberg Businessweek's 2010–2014 redesign under Richard Turley, executed by Code and Theory; the Neue Haas Grotesk lineage
- Best for: media and content publishing, AI product launches, brand-site heroes, research-report covers, and hero images for opinion-led long-form articles
- Visual DNA: pure black #000 + pure white #FFF + hyperlink blue #0000EE, accented by signal orange-red #FF433D or terminal green #00A33E. Helvetica or Neue Haas Grotesk. A tightly tracked, left-aligned 120px+ headline sits directly against 14px body copy, creating extreme scale contrast. A modular grid is divided by 1px rules; information density is deliberately high and whitespace is scarce. Signatures: ruled columns, underlined blue links, and large black-or-white color fields.
- HTML implementation: reproducible 1:1 in pure CSS. Use CSS Grid for the modular layout, borders for column rules, `clamp()` for oversized responsive type, and tightened `letter-spacing`. Use a system Helvetica/Arial stack with Inter as fallback, and render links as directly underlined #0000EE. No asset dependency.
- Type: Inter in place of Helvetica/Neue Haas Grotesk; Geist Mono for code

**Color-Blocked Neo-Brutalist Feed (Heavy Black Card Outlines + High-Saturation Clashes)** `Bold · 95% fidelity`
- References: The Verge's 2022 redesign by its in-house team, using PolySans + Mānuka
- Best for: media and content sites, AI product directories, event landing pages, community rankings, and Xiaohongshu-style information cards
- Visual DNA: highly saturated electric violet #5200FF through magenta #E1306C as primary colors, bright yellow #F8E000 for emphasis, plus near-black #08080D and white. Large clashing color fields are intentionally abrasive rather than harmonious. Geometric sans-serif display type contrasts with serif body copy. The layout is a card-based feed with 2–4px black outlines, hard color regions, and almost no rounding. Signatures: heavy outlined cards that invert to a clashing color on hover, and the character of an intentionally unfinished interface.
- HTML implementation: a pure-CSS strength. Combine `border: 3px solid #000`, a hard offset `box-shadow: 4px 4px 0 #000`, Grid/Flexbox card feeds, and `:hover` background inversions. It requires neither 3D nor lighting effects.
- Type: Space Grotesk in place of PolySans + a serif such as Fraunces

**Memphis Retro-Collage Maximalism (Clashing Blocks + Misregistered Layers + Vintage Type)** `Bold · 72% fidelity`
- References: Gucci Vault concept stores under Alessandro Michele; the Memphis movement and Sagmeister's rebellious streak
- Best for: concept e-commerce, creative event pages, experimental brand campaigns, Y2K nostalgia, and holiday marketing pages
- Visual DNA: large adjacent fields of vintage red, mustard yellow, royal blue, violet, and olive green over a distressed warm-beige ground—intense and deliberately discordant. Vintage serifs mix with decorative faces and print-like texture in an off-grid, layered composition. Modules vary in size, overlap, and feel like rooms in a digital exhibition. Signatures: clashing color fields, misregistered layers, and Easter eggs hidden in unconventional navigation.
- HTML implementation: use `transform: rotate()` for misregistration, `position: absolute` for overlaps, high-saturation backgrounds, and vintage Google Fonts. CSS cannot reproduce authentic distressed texture; reduce it to flat fields with `mix-blend-mode` or a contrast filter as a texture cue. The geometric-collage version holds up, while the archival distressed version loses fidelity.
- Type: DM Serif Display + Bungee for decoration + Space Mono

**Friendly Geometric Candy (Raised, Tactile Buttons + Gamification)** `Bold · 85% fidelity`
- References: Duolingo by Johnson Banks + Monotype, including Feather Bold; a rejection of Silicon Valley minimalism
- Best for: language education, consumer-app landing pages, gamified products, approachable mass-market products, and event registration
- Visual DNA: candy-saturated Duo green #58CC02 + duck yellow #FFC800 + sky blue #1CB0F6 on white; round and friendly. Extra-bold rounded type carries the feel of Feather Bold. Large-radius cards, raised 3D buttons with hard bottom shadows that imply pressability, a mascot zone, and progress bubbles. Signatures: tactile buttons with a 3px solid-bottom shadow, press-down motion, and very large corner radii.
- HTML implementation: pure CSS. Create a raised button with a hard `box-shadow: 0 4px 0 currentColor`; on `:active`, apply `translateY(4px)` and remove the shadow to simulate a press. Use large `border-radius` values and flat color fields. Without generated imagery, replace the mascot with CSS geometry or an honest labeled placeholder, with a slight fidelity reduction.
- Type: Baloo 2 / Nunito as extra-bold rounded substitutes for Feather

**Pure-CSS Art with Responsive Transformation Easter Eggs** `Bold · 80% fidelity`
- References: Lynn Fisher's lynnandtonic.com, a landmark of pure-CSS art profiled by Adobe
- Best for: personal homepages, creative 404 or Easter-egg pages, playful brand landing pages, technical-blog heroes, and designer portfolios
- Visual DNA: two to four high-contrast flat colors, with the palette changing at each breakpoint. Bold geometric sans-serif headlines. The central idea is that the image transforms with the viewport: the same CSS shapes recombine into different scenes at different breakpoints, such as a building gaining or losing floors as the screen width changes. Signatures: geometric illustrations drawn entirely in CSS, breakpoint-driven recomposition surprises, and zero images.
- HTML implementation: a natural arena for pure-CSS virtuosity, where the lack of assets is an advantage. Stack shapes from divs using `border-radius`, `clip-path`, `transform`, and `box-shadow`; change their size and position in `@media` queries. The challenge is conceptual design, not technology, but every shape must be crafted carefully.
- Type: Rubik / Archivo as bold geometric substitutes for custom lettering

**Bold Big-Type Editorial (Monochrome Fashion Broadside)** `Bold · 88% fidelity`
- References: the Jacquemus website, Rik Oostenbroek, Domestika, and fashion-magazine broadsides
- Best for: fashion e-commerce, portfolios, media features, brand manifestos, video-course covers, and large-type versions of research reports
- Visual DNA: minimal black and white with one restrained accent, such as nude pink #E8C4C0 or true red. Oversized display sans or high-contrast serif type fills the screen. A full-bleed grid pits giant type against negative space, often with a 1:1 image/text split. Signatures: viewport-dominating headlines, luxury-grade whitespace, and precisely aligned left/right compositions.
- HTML implementation: perfectly reproducible in pure CSS. Combine giant `clamp()` type, full-bleed CSS Grid splits, generous padding, and `vh` sizing that lets a title occupy the viewport. Without imagery, replace fashion photography with flat color or text blocks; fidelity falls slightly, but the composition remains valid.
- Type: Archivo Expanded / Anton for display + Playfair Display as the high-contrast serif

**Cosmic Retro-Futurism (Vintage Astronomical Catalog)** `Bold · 75% fidelity`
- References: the Perplexity Comet browser launch site, described by The Brand Identity as black/blue/cream, with the atmosphere of *2001: A Space Odyssey*
- Best for: AI product launches, technology-brand manifestos, event countdowns, futuristic landing pages, and concept launches
- Visual DNA: near-black #0A0A0A + cream paper #F0EAD8 + a trace of cobalt-to-peacock blue #2B4F91, muted like a vintage astronomy catalog. High-contrast serif type and generous whitespace evoke a classical celestial atlas. The layout uses SVG orbit lines and parabolas, planetary dots, black type on cream, and antique-book typography. Signatures: SVG celestial trajectories, the cream/blue/black triad, oversized vintage serif type, and astronomical-catalog materiality.
- HTML implementation: pure CSS + SVG reproduces roughly 80% of the static atmosphere. Draw orbital parabolas with SVG paths, position planetary dots radially in CSS, define the three-color system as variables, and use high-contrast serif type. The missing centerpiece is a full-screen video transition from space down to Earth; reduce it to CSS scroll parallax plus rotating SVG orbits.
- Type: Cormorant Garamond / EB Garamond for high-contrast serif + Space Mono

**Cinematic Sound-Viz Dark** `Bold · 72% fidelity`
- References: ElevenLabs; cinematic title sequences—Saul Bass-like minimal motion—crossed with audio-engineering interfaces
- Best for: audio and speech-AI products, music-technology sites, podcast platforms, media launches, and cinematic brand heroes
- Visual DNA: pure black #000 + pure white type + a blue-violet gradient waveform accent. Large sans-serif headlines carry Saul Bass-like reduction. A full-bleed dark field is traversed by waveform or spectrum visualizations, with giant titles layered over the waveform and card-based feature areas below. Signatures: a colored audio-waveform band, minimal title-sequence drama, high-contrast monochrome with a single gradient, and sound visualization as the governing motif.
- HTML implementation: pure CSS + SVG captures about 70% of the character; the structure is exact, but the waveform is the reduction point. Draw a static waveform with an SVG polyline, or animate uneven div bars as an approximate "fake waveform." Pure CSS cannot reproduce a real-time Web Audio/Canvas spectrum: the static version looks right, but the dynamic soul is missing.
- Type: Inter / Sora as large-scale sans serif

**Pixel-Game Side-Scroller** `Bold · 70% fidelity`
- References: Robby Leonardi's interactive résumé, an 8/16-bit platform-game narrative paying homage to Nintendo's SNES era
- Best for: creative résumés and portfolios, playful brand campaigns, gamified landing pages, event Easter eggs, and personality-led homepages
- Visual DNA: a sequence of retro-game zones—forest-green #4CAF50 grass under sky blue #5DADE2, transitioning into space violet #2C2A4A, volcanic orange-red #E8743B, and underwater teal #1ABC9C. Every "level" receives a different saturated cartoon palette. Pixel type with an 8-bit feel pairs with a bold sans. The layout moves through horizontally or vertically scrolling levels, parallax layers, and scroll-triggered movement. Signatures: level-by-level palette changes, pixel aesthetics, parallax scrolling, and game-HUD UI.
- HTML implementation: pure CSS plus a small amount of JavaScript reproduces the framework; the original itself used HTML + CSS + jQuery with no WebGL. Use positioned layers with scroll displacement, `image-rendering: pixelated`, frame-by-frame sprite animation through `background-position`, and sectional background colors. The missing component is original hand-drawn pixel art for characters and environments. Without generated imagery, substitute simple pixel icons assembled from CSS squares: the art direction is reduced, but the technique is not.
- Type: Press Start 2P / VT323 for pixel type + Inter


#### Neutral

**Bauhaus Geometric (Geometric Mark + Flat Illustration System)** `Neutral · 90% fidelity`
- References: Khan Academy's rebrand—the hexagon-and-petal mark and Wonder Blocks design system—and Bauhaus geometric composition
- Best for: educational course sites, brand-mark systems, infographics, child-friendly products, and event key visuals
- Visual DNA: a primary-color lineage of Bauhaus red #E63946, yellow #FFB703, and blue #0077B6 with black and white, assembled as flat color blocks. Rounded geometric sans-serif type. Illustrations are built from circles, triangles, and squares aligned to a grid as modular puzzles. Signatures: purely geometric marks, flat illustrations without gradients, and primary-color construction.
- HTML implementation: pure CSS handles the geometry completely. Use `border-radius: 50%` for circles, `clip-path` or borders for triangles, square divs for geometric illustration, and CSS Grid for alignment. Flat fills need no assets. Build illustrations from CSS shapes or hand-authored inline SVG paths.
- Type: Poppins / Manrope as rounded geometric alternatives to Wonder Blocks

**Dark Editorial Developer Portfolio (Dark Ground + One Fluorescent Accent + Mono Type)** `Neutral · 96% fidelity`
- References: Brittany Chiang's brittanychiang.com v4, a de facto standard for developer portfolios
- Best for: personal portfolios, developer-facing products, technology brands, résumé pages, and AI-tool landing pages
- Visual DNA: deep ink-green/navy #0A192F + slate-gray copy #8892B0 + one fluorescent aqua accent #64FFDA. Sans-serif body copy pairs with monospaced numbering and labels. A fixed left navigation column sits beside a scrolling main column, sections are numbered 01/02, and link underlines slide in on hover. Signatures: one accent color, monospaced number labels, and highlighted sidebar anchors.
- HTML implementation: fully reproducible in pure CSS. Use `position: sticky` for the fixed sidebar, a two-column CSS Grid, one accent variable, monospaced labels, and a transformed underline on `:hover`. No assets; only composition and micro-interaction.
- Type: Inter + JetBrains Mono

**Warm Editorial (Cream Paper + Terracotta Orange + Serif/Sans Pairing)** `Neutral · 97% fidelity`
- References: Anthropic / Claude by DBCo + Geist Studio, using Styrene × Tiempos; Penguin and Pelican paperback typography
- Best for: AI product sites, brand websites, long-form reading, Orange Book e-books, research reports, and training material
- Visual DNA: cream-paper #F5F0E8 + terracotta accents #CC785C/#D97757 + near-black text #191919; warm and muted. Tiempos-like serif headings pair with Styrene-like sans-serif body copy. The layout follows a book-like single-column reading flow with comfortable leading and restrained rules. Signatures: warm paper ground, terracotta orange, and publication-grade typographic rhythm.
- HTML implementation: 100% reproducible in pure CSS with no assets. Combine background-color variables, serif/sans stacks, a `max-width` that controls the measure, and comfortable `line-height: 1.7`. This is the natural home of Anthropic's warm terracotta language.
- Type: Fraunces / Newsreader in place of Tiempos + Inter in place of Styrene

**Linear-Like Dark Glow + Glassmorphism Bento** `Neutral · 85% fidelity`
- References: Linear / Cursor and the influential "Linear Look," for which Frontend Horse documents code recipes
- Best for: SaaS and AI product sites, developer tools, technology-brand heroes, product-feature showcases, and dark dashboard presentations
- Visual DNA: near-black #08090A + desaturated brand violet-blue #5E6AD2 + a muted cyan-violet glow gradient #4EA7FC→#B59AFF. Geometric sans-serif type is tightly set with negative tracking. The layout uses compartmentalized bento grids, hairline separators, and glassmorphic cards. Signatures: glowing gradient borders on a dark ground, bento modules, moving light streamers, and frosted glass.
- HTML implementation: strong pure-CSS fidelity. Build glow halos with `box-shadow`, `filter: blur`, and `radial-gradient`; glass with `backdrop-filter: blur`; borders with `conic-gradient` or `linear-gradient`; and the bento composition with CSS Grid. The only gap is authentic product-UI screenshots—replace them with simplified pseudo-UI assembled from text and flat blocks, with reduced fidelity in that area.
- Type: Inter / Geist with negative tracking + Geist Mono

**Angled Fluid Gradient** `Neutral · 92% fidelity`
- References: Stripe's signature angled-gradient banner and Klim's custom Söhne
- Best for: SaaS and fintech landing pages, brand-site heroes, product launches, event banners, and AI-product marketing pages
- Visual DNA: a multicolor fluid gradient—indigo #635BFF through cyan and pink to warm orange—as the hero background, followed by a pure-white content area and near-black type. Refined Söhne-like sans-serif typography. Angled color divisions create skewed sections, while the expressive gradient is held in check by a structured grid below. Signatures: angled boundaries, multicolor fluid gradients, and rational grid typography disciplining the expressive background.
- HTML implementation: pure CSS. Create angled sections with `transform: skewY()` or `clip-path: polygon()`. Layer multicolor `linear-gradient`s, optionally with slow CSS animation, to form the fluid band; use Grid for the structured content below. No assets.
- Type: Inter / Hanken Grotesk in place of Söhne

**Utility-First Colorful Docs** `Neutral · 98% fidelity`
- References: Tailwind CSS Docs, with its Sky/Cyan brand colors and rainbow hue bars for functional categories
- Best for: technical documentation, API references, design-system sites, tutorials, developer knowledge bases, and SaaS help centers
- Visual DNA: brand Sky blue #38BDF8 + a teal→cyan→sky gradient + Slate neutrals #0F172A/#64748B/#F8FAFC. Rainbow category bars—pink #EC4899, violet #A855F7, green #10B981, and orange—distinguish functional groups. Crisp sans-serif body type pairs with monospaced code. The skeleton has left navigation, central content, and right-side table of contents, with colorful syntax-highlighted code and category markers. Signatures: cyan-blue gradient hero, rainbow taxonomy, three-column documentation frame, and syntax-highlighted code blocks.
- HTML implementation: 98% fidelity in pure CSS; the reference is itself documentation for a CSS framework. Use a three-column Grid, a cyan-blue `linear-gradient` hero, category-color variables, and spans for code syntax colors. Inter is open source; only dark-mode switching and copy controls require lightweight JavaScript. No lighting, 3D, or hand-drawn imagery.
- Type: Inter + JetBrains Mono / Fira Code for code

**Terminal-Core Soft-Futurism (Monospace + Isometric Cube)** `Neutral · 80% fidelity`
- References: Cursor by Anysphere; developer-terminal aesthetics crossed with Teenage Engineering's industrial minimalism
- Best for: AI coding-tool sites, CLI product landing pages, developer infrastructure, technology-brand heroes, and terminal products
- Visual DNA: charcoal #0B0D14 + warm-white text #F2F0EF + a restrained blue-violet gradient accent on buttons and halos. Monospaced type is the protagonist, carrying a command-line character, with sans serif in support. The layout foregrounds command lines and code blocks, bento regions, and 2.5D isometric cube diagrams. Signatures: mono command lines, isometrically projected cubes, warm white against charcoal, controlled gradient halos, and industrial minimalism.
- HTML implementation: 80% fidelity in pure CSS. Combine mono code blocks, a dark bento, and `box-shadow` halos. Hand-build the 2.5D isometric cube with CSS 3D `transform` using `rotateX`/`rotateY` + `skew`, or with an SVG isometric projection. A clickable multi-interface demo requires JavaScript and assembled pseudo-UI. WebGL is not required.
- Type: Geist Mono / JetBrains Mono as the protagonist + Inter in support


#### Quiet

**Functional Brutalism (Gray Rules + System Type + Blue Links)** `Quiet · 98% fidelity`
- References: Are.na / Lobsters / Quartz; Müller-Brockmann's grid translated to digital interfaces + Tufte's information density
- Best for: communities and UGC platforms, content aggregators, documentation and knowledge bases, mobile-first feeds, and products for technical audiences
- Visual DNA: near-white #FBFBFB + black text + 1px gray separators #E0E0E0 + classic link blue #0000EE and visited-link violet. An unadorned system stack such as `-apple-system`. Dense information lists, thin gray column rules, minimal whitespace, and tight leading. Signatures: hairline gray separators, blue links, system type, and information density as the priority.
- HTML implementation: among the easiest styles to reproduce in pure CSS; this is the native language of Brutalist Web design. Use list rows with a 1px gray `border-bottom`, a `system-ui` stack, tight padding, and blue links. It needs almost no assets or JavaScript—only structure.
- Type: `system-ui` stack / IBM Plex Sans as fallback

**Gallery Dark (Deep-Black Negative Space + Single-Column Large Images + EXIF Microcopy)** `Quiet · 75% fidelity`
- References: Glass at glass.photo / Bottega Veneta; darkroom galleries + Apple Photos' content-first approach
- Best for: photography portfolios, luxury e-commerce, immersive visual-content display, personal galleries, and high-end product presentation
- Visual DNA: near-black #0A0A0A, with the artwork supplying the only color, plus faint gray EXIF microcopy #666. Very light, small sans-serif type. Large centered images sit in a single column, framed by expansive negative space, with metadata set underneath. Signatures: darkroom black, a receding content-first UI, EXIF-like footnotes, and imagery that owns the viewport.
- HTML implementation: pure CSS reproduces the compositional skeleton. Use a black ground, a centered `max-width` single column, generous framing padding, and small metadata. The missing ingredient is the photography itself. Placeholders or flat blocks lose the soul, though the darkroom atmosphere and composition remain 100% achievable.
- Type: Inter at weight 300 / optional Cormorant for serif luxury

**Swiss Monochrome (Vercel-Like Pure Black and White + Geist + Sharp Corners)** `Quiet · 98% fidelity`
- References: Vercel / Next.js Docs, whose Geist family is open source; Massimo Vignelli's reduction
- Best for: developer-tool documentation, technology-brand sites, AI products, SaaS landing pages, and minimalist research reports
- Visual DNA: pure black #000 + pure white #FFF + gray #888, with no chromatic color or at most one blue link. Geist geometric sans + Geist Mono. Sharp right angles, no rounding or only the smallest radius, high contrast, a precise grid, and disciplined whitespace. Signatures: pure monochrome, sharp corners, Geist, and triangular or arrow-like geometric marks.
- HTML implementation: 100% reproducible in pure CSS, with the open-source Geist available directly. Use a precise CSS Grid, black-and-white variables, `border-radius: 0`, and hairline borders. This is HTML's natural minimalist territory and needs no assets.
- Type: Geist + Geist Mono, the original open-source Vercel family

**Kenya Hara White Gallery (Japanese Whitespace + White-Box Curation)** `Quiet · 80% fidelity`
- References: Cosmos at cosmos.so / Aesop; the emptiness of Kenya Hara's *White* crossed with Swiss grids
- Best for: high-end e-commerce, creative galleries, content curation, designer portfolios, brand boutiques, and moodboard sites
- Visual DNA: near-white #FAFAFA + black text #0A0A0A + extremely pale separators #EFEFEF. Content imagery supplies all color while the UI recedes. Minimal system or geometric sans microcopy uses generous tracking. A masonry grid, extreme whitespace, pale hairline dividers, and an Eastern sense of emptiness define the composition. Signatures: white-box aesthetics, luxury whitespace, content-first UI retreat, and waterfall curation.
- HTML implementation: pure CSS reproduces the static composition, distinguished from Gallery Dark by the role of white. Use CSS columns or Grid for masonry, near-white variables, generous padding, and pale dividers. The gap is the smooth inertial scrolling and eased image entrances of Lenis/GSAP—roughly 60% of the perceived refinement. Basic CSS transitions reduce the motion layer.
- Type: light-weight Inter / Cooper Hewitt, the open-source family used by Aesop


## PPT Style Library (20 Styles)

#### Bold

**Neo-Swiss Billboard Editorial** `Bold · 98% fidelity`
- References: the Big-Number Editorial school seen in AI/SaaS fundraising decks such as Scribe's $75M and Flock Safety's $47M rounds; Bloomberg Businessweek infographics; Pentagram
- Best for: fundraising pitches, QBRs and business reviews, annual trend retrospectives, and key product-launch slides
- Visual DNA: pure white #FFFFFF or near-black #0A0A0A + one highly saturated accent—electric blue #2D5BFF, fluorescent green #00E676, or brand orange #FF6B2C—plus neutral grid lines #E5E5E5. Oversized bold sans-serif headlines occupy half the slide; numbers use tabular figures with tight tracking. Masters: ① a chapter divider containing one word on a large color field; ② a giant number occupying half the slide, such as 3.2x, with a small annotation; ③ a left/right comparison; ④ full-width flat line or bar charts. Signatures: billboard-scale type, a strict baseline grid, and large color-field dividers.
- HTML implementation: giant numbers with `clamp()`; strict grids with CSS Grid; chapter fields with `background-color`; line and bar charts from pure divs + CSS or inline SVG, which stays sharper than an image; aligned figures through `font-variant-numeric: tabular-nums`. No illustration or 3D.
- Type: Inter / Geist / Schibsted Grotesk as alternatives to Neue Haas Grotesk; Geist Mono for numbers

**Black Big-Number Stage** `Bold · 97% fidelity`
- References: Steve Jobs's 2007 iPhone Keynote, Lei Jun's Xiaomi SU7 Ultra launch, Spotify Wrapped, and Garr Reynolds's *Presentation Zen*
- Best for: product-launch keynotes, idea-led presentations, all-hands town halls, and emotionally driven annual retrospectives
- Visual DNA: pure black #000000 + pure white #FFFFFF at maximum contrast, with one brand accent per slide—Xiaomi orange #FF6900, Spotify green #1ED760, or Apple blue #2997FF. Bold geometric sans. One word or one giant number fills the field with tight tracking. Masters: ① a black title slide with one centered line; ② a data-climax slide with a giant number, unit, and one-line annotation; ③ a two-column parameter comparison, accent versus gray; ④ a single-slide slogan. Extensive negative space.
- HTML implementation: black and white need only a few CSS declarations; center giant figures with `clamp()` + Flexbox; isolate the accent in a highlight span; build the two-column comparison with CSS Grid and bar highlights; use tabular figures. Removing product photography in favor of pure type can move the result closer to the essence of Zen.
- Type: Geist / Inter / Source Han Sans in place of SF Pro

**Mono-Brand Type-as-Hero (High-Saturation Brand-Color Poster)** `Bold · 96% fidelity`
- References: Spotify Wrapped's visual system, the Mailchimp Brand Book by Collins, a modern reprise of Netflix red and black, and COLLINS brand systems
- Best for: brand and marketing strategy, campaign presentations, town-hall culture slides, and event key visuals
- Visual DNA: one brand color covering the full slide—Spotify green #1ED760, Mailchimp yellow #FFE01B, or Netflix red #E50914—with contrasting black or white type, creating a two-layer collision. Oversized type is the visual itself, extending from edge to edge. Masters: ① full-color ground + giant reversed-out type; ② a two-color horizontal or vertical split; ③ a giant number filling the slide. Signatures: full-bleed monochrome, type as image, and high-contrast color collision.
- HTML implementation: full-bleed `background-color`; giant type through `clamp()`; two colors as equal full-slide fields; type-as-image through `font-weight: 900` and negative `letter-spacing`. Flat color needs no assets and is native HTML at its best.
- Type: Inter / Manrope / extra-bold Archivo in place of Circular or Cavendish

**Full-Bleed Gradient Manifesto** `Bold · 82% fidelity`
- References: Zuora's *Tell a Different Story* sales deck as analyzed by Andy Raskin, Nike's *Just Do It* campaign, and National Geographic spreads
- Best for: vision slides in sales proposals, brand manifestos, keynote turning points, and single-slide mission or vision statements
- Visual DNA: a full-bleed CSS gradient—warm orange to magenta, or deep blue to cyan—or a solid bleed, with a giant reversed-out manifesto and hashtag slogan such as #shifthappens. Heavy all-caps sans-serif slogans run across the field. Masters: ① full-bleed gradient + centered reversed-out manifesto; ② promised-land vision slide; ③ client-logo wall. Signatures: full bleed, large reversed-out declarations, and hashtag slogans.
- HTML implementation: full-bleed `linear-gradient` or `radial-gradient`; pure-CSS gradients are allowed, while particles and lighting are not. Center reversed-out type with positioning. Build the logo wall as a grid of grayscale SVGs or text placeholders. Sections that originally depend on large documentary photography fall back to a CSS-gradient ground + large type; losing the photographs reduces fidelity by roughly 15%.
- Type: Archivo / Anton / extra-bold Manrope

**Candy-Color Lecture Stage (CS50 Single-Concept Method)** `Bold · 94% fidelity`
- References: Harvard CS50 with David Malan, the Lessig Method / Takahashi Method, and *Presentation Zen*
- Best for: educational decks, technical lectures, concept explanations, and coding instruction
- Visual DNA: deep black #0A0A0A + rotating high-saturation candy-colored words—magenta #FF2D95, cyan #00E5FF, bright yellow #FFD500, and green #39FF14. Enormous sans-serif words float at center; one concept per slide and almost no copy. Masters: ① one candy-colored word on deep black; ② monospaced, syntax-highlighted code; ③ stage-spotlight typography. Signatures: bright words floating on black, mono syntax highlighting, strong stage focus, and extreme textual economy.
- HTML implementation: center one giant colored word on black with `clamp()`; build syntax highlighting with `pre`, mono type, and colored spans; suggest a spotlight with an extremely subtle vignette from `radial-gradient`, not a particle effect. High fidelity.
- Type: extra-bold Inter + JetBrains Mono for code

**Playful Maximalist Editorial (Collins-Like Hand-Drawn Minimalism)** `Bold · 75% fidelity`
- References: the 2018 Mailchimp Brand Book by Collins, the character of *New Yorker* cartoons, Cooper's rounded serifs, and Cavendish fluorescent yellow
- Best for: opinionated brand decks, creative-agency proposals, culture-focused town halls, and marketing that rejects SaaS minimalism
- Visual DNA: large fields of Cavendish fluorescent yellow #FFE01B + black + a few clashing colors. This is anti-SaaS minimalism. Cooper-like rounded serif display type pairs with magazine-like whitespace. Masters: ① fluorescent-yellow ground + eccentric headline; ② irregular editorial whitespace; ③ oversized copy built around a joke. Signatures: fluorescent yellow, rounded serif type, playful composition, and eccentric hand-drawn energy—reduced to geometric blocks or emoji when real illustration is unavailable.
- HTML implementation: fluorescent-yellow background, rounded serif `font-family`, and asymmetric Grid for editorial whitespace. The hand-drawn chimpanzee and illustration work is central but impossible without image generation; reduce it to CSS geometry, oversized typographic symbols, and irregularly rotated text blocks. Missing illustration reduces fidelity by roughly 20%.
- Type: Fraunces, using its rounded axis, / Bree Serif in place of Cooper; Inter for body copy

**Irreverent Pop (Reddit-Like)** `Bold · 80% fidelity`
- References: Reddit Ads' sales deck, named by Dock as one of the most characterful; David Carson's unruly typography; '90s web nostalgia; playful Memphis
- Best for: Gen Z brands, meme-driven marketing decks, community and creator audiences, and proposals willing to be unserious
- Visual DNA: Reddit orange-red #FF4500 + clashing '90s-web colors. Mixed typography breaks the grid in a David Carson-like composition, paired with colloquial, joke-driven copy. Masters: ① fun slides with oversized jokes; ② a rhythmic turn into serious data on facts slides; ③ conversational headlines. Signatures: broken-grid type mixing, orange-red, meme language, a fun→facts tonal reversal, and retro-web materiality.
- HTML implementation: deliberately break the grid with rotated transforms, overlapping position, and mixed scales; use orange-red clashing fields; create retro materiality with thick black borders and hard `box-shadow` without blur. Custom meme illustration falls back to a labeled media placeholder or geometric collage, but HTML can reproduce the typographic disorder itself.
- Type: Archivo / Space Grotesk mixed with Inter for contrast

**Y2K Inflated Display Type / Maximalist 3D-Type (Wrapped-Like)** `Bold · 78% fidelity`
- References: Spotify Wrapped 2022/2023/2025, Memphis color collisions, Y2K maximalism, and duotone portrait gradients
- Best for: emotionally shareable year-in-review decks, personalized data cards, vertical social cards, and brand year-ends
- Visual DNA: full-bleed high-saturation collisions of magenta + cyan + orange, punctuated by Spotify green and duotone gradients. Giant edge-to-edge numbers; years and figures appear inflated in 3D or metallic. Masters: ① clashing full-bleed color + inflated giant numbers; ② duotone portrait or color-field ground + reversed type; ③ shareable vertical cards. Signatures: inflated 3D figures, full-bleed color collision, duotone gradients, metallic years, and vertical story cards.
- HTML implementation: full-bleed clashing backgrounds; create pseudo-3D inflation with layered CSS `text-shadow` plus `transform: perspective(800px) rotateX(...)`, or SVG + stroke rather than real 3D rendering; create duotone by overlaying a gradient on a grayscale-image placeholder with `mix-blend-mode`. Reduce metallic type to a gradient fill using `background-clip: text; color: transparent` plus the `-webkit-background-clip` fallback, lowering fidelity by roughly 15%.
- Type: extra-bold Archivo Black / Anton + Bricolage Grotesque for figures


#### Neutral

**Bento Grid** `Neutral · 95% fidelity`
- References: Apple's Keynote bento era, the new generation of MBB Bento/Big-Type decks from 2024–2026, Stripe annual-report metric-card matrices, and Pitch.com QBR templates
- Best for: product-feature summaries, consulting and QBR data reviews, sales-results slides, and town-hall metrics
- Visual DNA: light gray or cream #F5F5F7, or near-black, combined with the brand primary and one or two accents. Cards use lightly differentiated surfaces, rounded corners, subtle outlines, or faint shadows. Oversized display headings contrast strongly with regular body copy; KPI figures use tabular forms. Masters: ① giant one-sentence title + whitespace; ② a 2×2 or three-column bento of unequal-height cards, one insight per card—figure, line icon, or sparkline; ③ one-insight giant-number slide. Signatures: unequal card grids, rounded hairline cards, and breathing room.
- HTML implementation: use CSS Grid `grid-template-areas` for the unequal bento; card `border-radius`, a subtle `box-shadow`, and a 1px hairline; inline SVG for sparklines; inline SVG strokes for line icons. No raster assets.
- Type: Inter / Geist + Geist Mono for figures

**Neo-Swiss Dark Hairline Terminal** `Neutral · 94% fidelity`
- References: Linear's pitch deck, Vercel's design language, and CS50's deep-black lecture slides; Inter Tight + JetBrains Mono
- Best for: developer-tool and technology-product launches, technical pitches, and engineering presentations
- Visual DNA: near-black #0D0D0F/#111113 + hairline grid #262629 + one violet-blue accent #5B5BD6/#7C7CFF. Inter Tight headlines pair with JetBrains Mono labels and data. Masters: ① a minimal title slide with one sentence + a small mono kicker; ② a data grid divided by hairlines; ③ a feature list with mono labels. Signatures: 1px grids, monospaced labels, extreme whitespace, and near-black rather than pure black.
- HTML implementation: near-black background + hairline grid from `border: 1px solid`; mono labels through the font stack; a faint `box-shadow` or border highlight rather than real glow, avoiding the cyber-neon exclusion zone. Avoid the forbidden deep blue #0D1117; use a neutral near-black.
- Type: Inter Tight + JetBrains Mono / IBM Plex Mono

**Two-Font Consulting (Bower-Like)** `Neutral · 90% fidelity`
- References: McKinsey's 2019 identity by Wolff Olins, pairing Bower serif with sans serif; BCG Executive Perspectives; deep-blue fine-line patterns
- Best for: consulting reports, executive presentations, industry research, and proposals from authoritative institutions
- Visual DNA: deep blue #051C2C—McKinsey blue—and white, with one brand highlight such as BCG green #00805A, over a breathable warm-gray ground. Characterful Bower-like serif display type contrasts with sans-serif body copy. Masters: ① conclusion-led action title at top left; ② blue fine-line pattern; ③ editorial left/right division between conclusion and visual; ④ large-number data-point card. Signatures: strong serif/sans contrast, deep-blue line patterns, action titles, and refined warm gray.
- HTML implementation: juxtapose two `font-family` stacks, serif for titles and sans for body copy; make the fine-line pattern with `repeating-linear-gradient` or SVG lines; build data-point cards in pure CSS; omit grayscale-photo treatment when no photograph exists. Reduce blue-violet edge shimmer to a solid border.
- Type: Playfair Display / Fraunces for serif titles + Inter body in place of Bower

**Diagram-Driven Isotype** `Neutral · 88% fidelity`
- References: Salesforce sales decks, the Isotype lineage of Otto Neurath, Gene Zelazny's *Say It With Charts*, and Hans Rosling / Gapminder
- Best for: platform and architecture explanation, customer journeys, process methodologies, and ecosystem maps
- Visual DNA: corporate-blue fields, differentiated product-line colors, and an icon-based capability grid. Clear sans-serif type. Masters: ① horizontal arrow-flow customer journey; ② layered platform architecture; ③ icon capability grid; ④ 2×2, waterfall, or pyramid structure. Signatures: arrow flows, layered architecture boxes, Isotype icon grids, and process as narrative.
- HTML implementation: build arrow flows with Flexbox + CSS `clip-path` triangles or SVG arrows; architecture layers with nested bordered divs; icons with consistent inline SVG strokes; waterfalls and pyramids with Grid + angled cuts. Bubble charts can use positioned CSS circles. Pure vector construction.
- Type: Inter / IBM Plex Sans for chart-friendly forms

**Diagrammatic Minimalism (One Governing Diagram)** `Neutral · 95% fidelity`
- References: Simon Sinek's Golden Circle TED talk, Bauhaus geometric abstraction, and the information-architecture principle that one image can govern the whole presentation
- Best for: theoretical frameworks, TED-like idea communication, model and methodology visualization, and single-concept keynotes
- Visual DNA: minimal white or pale ground + black + one accent, all in flat geometric color. Sans-serif type with uppercase labels embedded inside shapes. Masters: ① one governing diagram—concentric circles, triangle, or matrix—holding the entire concept; ② inside-out arrows; ③ comparison example. Signatures: a single master geometry, nested circles or triangles, uppercase labels, and one diagram carrying the concept.
- HTML implementation: nested divs or SVG circles with `border-radius: 50%` for concentric rings; `clip-path` or SVG polygons for triangles; SVG markers for arrows; absolutely positioned labels attached to the shapes. Pure geometry, perfectly reproducible in HTML.
- Type: Manrope / Jost, the open-source geometric alternative in the Futura lineage

**Narrative Sparkline (Duarte-Like)** `Neutral · 91% fidelity`
- References: Nancy Duarte's sparkline narrative map in *Resonate*, Al Gore's *An Inconvenient Truth*, and Duarte Inc.'s data storytelling
- Best for: speech structure, change narratives, before/after comparisons, and data-story arcs
- Visual DNA: dark or white ground + brand orange at turning points + grayed comparisons. Sans-serif type with annotated points. Masters: ① oscillating waveform spanning the screen; ② text annotations on the waveform; ③ stacked comparison waves; ④ one data line suspended on black; ⑤ progressive reveal. Signatures: a spanning waveform, annotated points, orange turns, comparison waves, and a curve that appears to climb out of the frame.
- HTML implementation: draw the waveform with a smooth Bézier inline SVG path; place SVG circles + text at annotations; use two paths for comparison waves; animate reveal with CSS `stroke-dashoffset`. Pure SVG, no assets.
- Type: Inter + Geist Mono for figures


#### Quiet

**Assertion–Evidence / Tufte Information Design** `Quiet · 93% fidelity`
- References: Michael Alley's empirically tested Assertion–Evidence method at Penn State, McKinsey/BCG action titles, Edward Tufte's data-ink ratio, and Barbara Minto's Pyramid Principle
- Best for: academic and engineering presentations, data-rigorous consulting, policy research, and technical reviews
- Visual DNA: white or extremely pale gray + black body copy + one restrained accent such as deep blue or brick red. The title is a complete sentence rather than a noun phrase; one chart occupies the space beneath it, with annotations embedded directly in the visual. Masters: ① complete-sentence action title; ② one evidence graphic below; ③ zero bullets. Signatures: sentence titles, single-graphic evidence, embedded annotations, no chartjunk, and a high data-ink ratio.
- HTML implementation: establish the sentence title through typographic hierarchy; draw minimal lines and scatterplots in pure CSS or inline SVG, removing gridlines and legends and positioning text beside each data point; add no decoration. Tufte's restraint is an HTML strength.
- Type: Source Serif / Lora for titles + Inter body, a reading-grade pairing

**Institutional Swiss Minimal** `Quiet · 96% fidelity`
- References: Sequoia's official ten-slide pitch template, Airbnb's 2009 seed deck, Müller-Brockmann's grid, and Massimo Vignelli
- Best for: investment pitches, standard business proposals, problem–solution narratives, and deliberately undecorated brand proposals
- Visual DNA: pure white + black/gray body copy + one brand accent such as Airbnb coral #FF5A3C or neutral blue. Helvetica-like sans serif; a medium-bold, one-sentence title and short body lines with generous spacing. Masters: ① centered logo + slogan; ② one-sentence title band above three balanced Problem/Solution columns; ③ layered TAM figures; ④ 2×2 competitive matrix. Signatures: title band, balanced three-column structure, one-color emphasis, and 2×2 matrix.
- HTML implementation: three balanced columns with Flexbox; 2×2 matrix drawn through CSS Grid + borders; TAM layers with nested divs or concentric squares; one message per slide. Nearly pure typographic grid, an ideal HTML subject.
- Type: Inter / IBM Plex Sans in place of Helvetica; Inter for body copy

**Editorial Longform** `Quiet · 95% fidelity`
- References: Stripe's $1.9T Annual Letter, Amazon's six-page narrative memo, Benedict Evans's "X eats the world," and Stripe Press
- Best for: annual letters and retrospective narratives, long-form ideas, internal updates, and research-report reading
- Visual DNA: cream/off-white #FBFAF8 + deep ink text + a brand accent such as Stripe violet #635BFF. Serif or high-quality sans typography carries essay-like paragraphs, inline data cards, and occasional oversized display figures. Masters: ① masthead-like title; ② multi-column prose + inline metric cards; ③ giant-number paragraph anchors. Signatures: publication reading rhythm, inline data cards, restrained whitespace, and prose rather than bullets.
- HTML implementation: use `column-count` or Grid for multiple columns; embed inline data cards with `float` or `inline-block`; constrain serif body copy to a 65ch measure with `max-width`; interrupt the flow with giant figures. Pure typography, no assets.
- Type: Newsreader / Source Serif for body + Inter in support; tabular figures

**Humanist Rounded Cards (Khan-Like)** `Quiet · 80% fidelity`
- References: Khan Academy's Wonder Blocks design system, Source Serif Pro, forest-green branding, and friendly humanism
- Best for: education products, approachable learning material, nonprofit decks, and warm brand proposals
- Visual DNA: forest green #14BF96/#0A5C4B + cream + warm supporting colors, gentle rather than sharp. Humanist Source Serif headings pair with sans-serif body copy. Masters: ① groups of rounded-card components; ② serif headings + friendly body copy; ③ authentic photography areas, reduced to green geometry or rounded color blocks when necessary. Signatures: forest green, serif headings, large-radius cards, human warmth, and approachable imperfection.
- HTML implementation: large-`border-radius` cards with soft `box-shadow`, serif display `font-family`, and warm cream ground. Without AI image generation, real teacher/student photography falls back to green geometric illustration blocks or clearly labeled, large-radius photo placeholders. Missing photography reduces fidelity by roughly 18%.
- Type: Source Serif 4 for titles + Nunito Sans / Inter body; Nunito's roundness reinforces the human tone

**Dense Research Report (Meeker-Like)** `Quiet · 92% fidelity`
- References: Mary Meeker's *Internet Trends* at BOND, CB Insights' *State of AI*, McKinsey Global Institute's *Year in Charts*, and FT/Bloomberg data journalism
- Best for: trend reports, industry-data retrospectives, dense data presentations, and market maps
- Visual DNA: white + a stepped monochrome brand highlight—BOND/CB Insights bright blue #0066FF—with everything else grayed, and almost no whitespace. Conclusion-led sentence titles, one-chart-per-slide density, and tiny source notes. Masters: ① conclusion title + full-slide chart; ② logo-grid market map; ③ large-number KPI card; ④ dense multi-chart grid + footnotes. Signatures: conclusion titles, research-report density, stepped monochrome emphasis, logo market maps, and disciplined source notation.
- HTML implementation: draw dense bars, lines, stacks, and scatterplots in pure CSS or inline SVG; build the logo market map as Grid + text/SVG placeholder cells; create KPI cards in CSS and footnotes in microtype. Extreme information density is an HTML strength, with no asset requirement.
- Type: Inter + IBM Plex Sans + tabular Geist Mono figures

**All-Text Manifesto (Netflix/Amazon-Like)** `Quiet · 97% fidelity`
- References: the 125-slide Netflix Culture Deck from 2009, Jeff Bezos's six-page Amazon narrative memo, Tufte's argument against PowerPoint, and Matthew Carter's reading-grade typography
- Best for: culture manifestos, values presentations, deep memos, and document-first presentations that reject conventional PPT
- Visual DNA: pure white or black + one accent, such as Netflix red #E50914, as the only highlight. Reading-grade typography carries one assertion or essay-like passage per slide, with no bullets and no imagery. Masters: ① full-slide ground + quotable assertion; ② candid conversational paragraph; ③ highlighted institutional term such as Keeper Test; ④ six pages of prose + appendix table. Signatures: one text-only idea per slide, zero imagery or bullets, one-color emphasis on key statements, candid language, and a silent-read document feel.
- HTML implementation: pure typography. Set key statements as large, left-aligned `clamp()` type; constrain prose measure with `max-width`; highlight key phrases in one accent span; use a minimal table for the appendix. With no assets and no images, text-only work is among HTML's most reliable reproductions.
- Type: Newsreader / Source Serif for reading or Inter for manifesto tone; optional extra-bold Archivo for titles


---

## ⚠️ Image-Generation-Only Styles (Recommend Only After Confirming Image-Generation Capability; Never Select by Default)

The soul of the following styles lies in **generated visual assets, custom real-time graphics, 3D, particles, cinematic lighting, or hand-drawn illustration**. The default static HTML/CSS path can produce only a severely reduced mockup, so **exclude them from the default recommendation pool**. Consider them only when the user has confirmed access to the runtime's image-generation tool, or has explicitly authorized a custom Canvas/WebGL implementation:

| Style | Essential quality | Why the default HTML/CSS path cannot reproduce it |
|------|------|------------------|
| Active Theory (WebGL particles) | 3D particle systems / real-time rendering | Requires a custom WebGL renderer rather than static DOM/CSS |
| Field.io (generative art) | Algorithmically generated graphics | Requires custom Canvas/WebGL code; static SVG produces only a rigid simplification |
| Resn (illustrated interaction) | Character illustration + gamification | Depends on hand-drawn assets |
| Zach Lieberman (real-time generation) | Creative-coding brushwork | Requires a custom real-time creative-coding implementation |
| Raven Kwok (parametric fractals) | Recursive fractals | Requires custom generative code beyond the default CSS path |
| Ash Thorp (cinematic lighting) | Cinematic volumetric light / concept art | CSS lighting is a degraded substitute |
| Territory Studio (holographic FUI) | Science-fiction holographic interfaces | Depends on many layered luminous assets |
| Neo Shen (ink diffusion) | Organic ink washes | A CSS gradient is not ink |
| Sagmeister & Walsh (color explosion) | Handmade physical work + experimental typography | The clashing-color skeleton is achievable and has been incorporated into the web Memphis style and PPT Mono-Brand poster style, but the handmade materiality is not |

> These styles are not bad; they belong to a different production path. Their native medium is generated imagery or a custom Canvas/WebGL renderer, not the default static DOM/CSS workflow.

---

## Default Aesthetic Exclusion Zone (The User's Brand May Override It)

- ❌ **The lazy GitHub-dark solution:** a uniform deep-blue #0D1117 ground + generic cyan/violet neon glow. Only this overused combination is excluded; dark design as a whole is not.
- ✅ **Not excluded:** cinematic dramatic lighting, warm cyber aesthetics such as Ash Thorp's orange/cyan, and dark-field narratives with kinetic poetry. Preserve dark work with authorial intent. This library's Linear-Like Dark Glow, Black Big-Number Stage, and CS50 Candy-Color Lecture Stage are all valid dark styles.
- ❌ The universal formula of aggressive violet gradients; emoji used as icons; rounded cards with a colored left-border accent, unless the brand itself uses that pattern
- ❌ Personal signatures or watermarks added to cover imagery

---

## Prompting When Image Generation Is Available (Mood, Not Layout)

> This applies only on the AI image-generation path. On the HTML path, implement the relevant style directly from its "HTML implementation" guidance above.

Short prompts are better than long prompts. Describing the mood and content is more effective than piling up 30 lines of layout detail.

| Wording that kills diversity | Wording that stimulates creativity |
|----------------|----------------|
| Specifying color ratios such as 60%/25%/15% | Describing a mood such as "warm like Sunday morning" |
| Prescribing layout positions | Citing a concrete aesthetic such as "Pentagram editorial feel" |
| Listing every visual element | Describing what the audience should feel |

For the complete AI image-generation method, follow the runtime's image-generation guidance.

---

**Version:** v3.0 (fully rebuilt in 2026-06 as a library of 40 HTML-native styles)
**Applies to:** the default HTML path for all visual design, including websites, PPT, PDF, infographics, covers, and apps
