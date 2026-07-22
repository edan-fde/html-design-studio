# Core Asset Protocol (Complete Version)

> The full protocol extracted from “Core Philosophy §1.a” in `SKILL.md` during the June 2026 reduction. `SKILL.md` retains the trigger conditions, five step titles, and self-check; this document contains detailed procedures, download commands, a `brand-spec` template, fallbacks for every failure, counterexamples, and a cost comparison.
> Trigger: mandatory whenever a task involves a specific brand or product. See `SKILL.md` for the abbreviated version and its surrounding context.

#### 1.a Core Asset Protocol (Mandatory for Specific Brands)

> **This is v1's most important constraint and the lifeline of output stability.** Whether an agent completes this protocol determines whether the result scores 40 or 90. Never skip a step.
>
> **v1.1 refactor (2026-04-20):** upgraded from a “brand asset protocol” to a “core asset protocol.” The previous version overemphasized color values and fonts while omitting the most fundamental design assets: logos, product images, and UI screenshots. Production note: “Beyond so-called brand colors, we obviously need to find and use DJI's logo and use Pocket 4 product imagery. For websites, apps, and other non-physical products, the logo should at least be mandatory. This may be more fundamental than the so-called brand-design spec. Otherwise, what are we communicating?”

**Trigger condition:** the task involves a specific brand—the user names a product, company, or explicit client such as Stripe, Linear, Anthropic, Notion, Lovart, DJI, or their own company—whether or not they proactively provide brand materials.

**Hard prerequisite:** before beginning this protocol, complete “§0 Facts Before Assumptions” and confirm that the brand or product exists and its status is known. If you are still uncertain whether the product has launched, which version applies, or what its specifications are, go back and research it first.

##### Core Principle: Assets > Specifications

The essence of a brand is **being recognized**. In descending order of contribution to recognition:

| Asset Type | Recognition Contribution | Requirement |
|---|---|---|
| **Logo** | Highest; a logo identifies any brand instantly | **Mandatory for every brand** |
| **Product image / render** | Extremely high; the physical product is the protagonist | **Mandatory for physical products: hardware, packaging, consumer goods** |
| **UI screenshot / interface asset** | Extremely high; a digital product's interface is the protagonist | **Mandatory for digital products: apps, websites, SaaS** |
| **Color values** | Medium; reinforces recognition but often resembles other brands without the first three assets | Supporting |
| **Typography** | Low; creates recognition only in combination with the assets above | Supporting |
| **Character keywords** | Low; used for agent self-checking | Supporting |

**In operational terms:**
- Extracting only colors and fonts while omitting the logo, product imagery, or UI **violates this protocol**.
- Replacing a genuine product image with a CSS silhouette or hand-drawn SVG **violates this protocol**. It creates generic technology animation in which every brand looks the same.
- Failing to find assets, saying nothing to the user, and proceeding without AI generation **violates this protocol**.
- It is better to stop and ask the user for material than to fill the design with generic substitutes.

##### Mandatory Five-Step Process (Every Step Has a Fallback; Never Skip Silently)

##### Step 1 · Ask for the Entire Asset Checklist at Once

Do not merely ask, “Do you have brand guidelines?” That is too broad; users may not know what to provide. Ask item by item:

```
Which of the following materials do you have for <brand/product>? Listed by priority:
1. Logo (SVG / high-resolution PNG) — mandatory for every brand
2. Product image / official render — mandatory for a physical product such as DJI Pocket 4
3. UI screenshot / interface asset — mandatory for a digital product, such as primary app screens
4. Color-value list (HEX / RGB / brand palette)
5. Typeface list (Display / Body)
6. Brand-guidelines PDF / Figma design system / official brand-site link

Send what you have. I’ll search, capture, or generate anything missing.
```

##### Step 2 · Search Official Channels by Asset Type

| Asset | Search Path |
|---|---|
| **Logo** | `<brand>.com/brand` · `<brand>.com/press` · `<brand>.com/press-kit` · `brand.<brand>.com` · inline SVG in the official site header |
| **Product image / render** | Hero image and gallery at `<brand>.com/<product>` · frames from an official YouTube launch film · images attached to an official press release |
| **UI screenshot** | App Store / Google Play product screenshots · screenshot section on the official site · frames from an official product demo video |
| **Color values** | Inline CSS on the official site · Tailwind configuration · brand-guidelines PDF |
| **Typography** | The site's `<link rel="stylesheet">` references · Google Fonts tracing · brand guidelines |

Fallback `WebSearch` queries:
- Missing logo → `<brand> logo download SVG`, `<brand> press kit`
- Missing product image → `<brand> <product> official renders`, `<brand> <product> product photography`
- Missing UI → `<brand> app screenshots`, `<brand> dashboard UI`

##### Step 3 · Download Assets with Three Fallback Paths per Type

**3.1 Logo (mandatory for every brand)**

> ⚠️ **Do not try only `curl <brand>.com/logo.svg` and give up.** Most modern websites are SPAs; direct static paths usually return empty HTML shells. On 2026-06-06, all five attempted direct paths on Trae's website returned shells. **For digital products, SaaS, and AI tools, try icon aggregators first**; they have the highest hit rate and return clean SVG.

In descending order of success rate:
0. **Icon aggregators** for well-known digital products, SaaS, and AI tools—the preferred, highest-success option:
   ```bash
   unset ALL_PROXY HTTP_PROXY HTTPS_PROXY all_proxy http_proxy https_proxy   # Clear proxies; otherwise TLS often fails
   # svgl — widest AI/developer brand coverage (Claude/Cursor/OpenAI/Copilot/Anthropic/Vercel…);
   # includes light/dark variants and wordmarks
   curl -s "https://api.svgl.app?search=<brand>"   # Returns JSON; retrieve the SVG URL from route(.light/.dark)
   # simpleicons — monochrome glyph that can be colored directly with the brand color
   curl -o logo.svg "https://cdn.simpleicons.org/<slug>/<hexcolor>"
   ```
1. Standalone SVG/PNG from an official brand page such as `<brand>.com/brand` or `/press`:
   ```bash
   curl -A "Mozilla/5.0" -L -o assets/<brand>-brand/logo.svg "<official-logo-url>"
   ```
2. Extract inline SVG from the complete official-site HTML:
   ```bash
   curl -A "Mozilla/5.0" -L https://<brand>.com -o assets/<brand>-brand/homepage.html
   # Then extract the logo node from <svg>...</svg>
   ```
3. **Google favicon service** as a near-universal fallback for the site's real mark:
   ```bash
   curl -o logo.png "https://www.google.com/s2/favicons?domain=<brand-domain>&sz=256"   # 256 px official-site icon
   ```
4. Official social-media avatar as a last resort. Company avatars on GitHub, Twitter/X, and LinkedIn are usually transparent PNGs at 400 × 400 or 800 × 800.

After downloading, **verify every file**: run `file <logo>` to confirm that it is a real SVG/PNG, not a 106-byte placeholder or an HTML shell; inspect `head -c 90 <logo.svg>` for `<svg`.

**3.2 Product Image / Render (mandatory for physical products)**

In priority order:
1. **Official product-page hero image**, the highest priority. Inspect the image address or retrieve it with `curl`; resolution is typically 2,000 px or more.
2. **Official press kit**. `<brand>.com/press` often includes high-resolution product downloads.
3. **Frame from an official launch video**. Download the YouTube video with `yt-dlp` and extract several high-resolution frames with `ffmpeg`.
4. **Wikimedia Commons**, which often provides public-domain imagery.
5. **AI-generated fallback** with `nano-banana-pro`: provide a real product image as reference and generate a variation suited to the animation scene. **Never substitute a CSS or SVG drawing.**

```bash
# Example: download a product hero image from DJI's official site
curl -A "Mozilla/5.0" -L "<hero-image-url>" -o assets/<brand>-brand/product-hero.png
```

**3.3 UI Screenshot (mandatory for digital products)**

- App Store / Google Play screenshots. Note that these may be mockups rather than actual UI; compare them carefully.
- Official website screenshot section.
- Frames from a product demonstration video.
- Release screenshots from the product's official Twitter/X account; these are often the latest version.
- When the user has an account, capture the genuine product interface directly.

**3.4 Asset Quality Gate: the “5–10–2–8” Rule (Non-Negotiable)**

> **Logos follow a different rule from other assets.** If a logo exists, use it; if it does not, stop and ask the user. Other assets—product imagery, UI, references, and supporting images—must pass the “5–10–2–8” quality gate.
>
> Production note, 2026-04-20: “Our principle is five rounds of search, ten candidate assets, and two good selections. Each must score at least 8/10. It is better to use fewer assets than to pad the task with inferior ones.”

| Dimension | Standard | Antipattern |
|---|---|---|
| **Five search rounds** | Cross-search several channels: official site, press kit, official social accounts, YouTube frames, Wikimedia, and screenshots from the user's account. Do not stop after two results in the first round. | Use the first page of results immediately. |
| **Ten candidates** | Gather at least ten options before evaluating. | Gather only two, leaving no real choice. |
| **Select two good assets** | Choose the best two from the ten as final assets. | Use everything, creating visual overload and diluting taste. |
| **Each scores at least 8/10** | If an asset scores below 8, **do not use it**. Use an honest placeholder—a gray block with a text label—or generate from an official reference with `nano-banana-pro`. | Pad `brand-spec.md` with 7/10 assets. |

Record these **8/10 scoring dimensions** in `brand-spec.md`:

1. **Resolution:** ≥2,000 px; ≥3,000 px for print or large-screen work.
2. **Rights clarity:** official source > public domain > free stock > suspected unauthorized copy. A suspected unauthorized copy scores zero immediately.
3. **Fit with the brand's character:** consistent with the character keywords in `brand-spec.md`.
4. **Consistency of light, composition, and style:** the two selected assets do not conflict when shown together.
5. **Independent narrative value:** each can carry a narrative role by itself rather than serving as decoration.

**Why this gate is non-negotiable:**
- The working principle is **quality over quantity**. A weak filler asset is worse than no asset: it pollutes visual taste and signals unprofessionalism.
- It quantifies **“one detail at 120%, everything else at 80%.”** Eight is the floor for the “other 80%”; the true hero asset should score 9–10.
- Every visual element either adds or subtracts points in the viewer's perception. A 7/10 asset subtracts points and is worse than empty space.

**Logo exception, repeated:** if it exists, use it; “5–10–2–8” does not apply. A logo is not a selection problem but the foundation of recognition. Even a 6/10 logo is ten times better than no logo.

##### Step 4 · Verify and Extract—Not Merely Grep Color Values

| Asset | Verification |
|---|---|
| **Logo** | File exists + SVG/PNG opens + at least two variants for light and dark backgrounds + transparent background |
| **Product image** | At least one image at 2,000 px+ + isolated or clean background + several angles: hero, detail, context |
| **UI screenshot** | Genuine 1× or 2× resolution + latest version rather than an old release + no exposed user data |
| **Color values** | `grep -hoE '#[0-9A-Fa-f]{6}' assets/<brand>-brand/*.{svg,html,css} \| sort \| uniq -c \| sort -rn \| head -20`, then exclude black, white, and gray |

**Beware contamination from demonstration brands:** product screenshots often contain the brand colors of a user's demo content—for example, Heytea red inside another tool. That is not the tool's own color. **When two strong colors appear together, distinguish their owners.**

**Multiple facets of one brand:** marketing-site colors often differ from product-UI colors. Lovart's website uses warm beige + orange, while its product UI is charcoal + lime. **Both are authentic.** Choose the facet appropriate to the deliverable.

##### Step 5 · Preserve Everything in `brand-spec.md` (Template Must Cover Every Asset)

```markdown
# <Brand> · Brand Spec
> Collected: YYYY-MM-DD
> Asset sources: <list download sources>
> Asset completeness: <complete / partial / inferred>

## 🎯 Core Assets (First-Class Citizens)

### Logo
- Primary: `assets/<brand>-brand/logo.svg`
- Reversed version for dark backgrounds: `assets/<brand>-brand/logo-white.svg`
- Usage: <opening/closing/corner watermark/global>
- Forbidden transformations: <do not stretch/recolor/outline>

### Product Imagery (Mandatory for Physical Products)
- Hero angle: `assets/<brand>-brand/product-hero.png` (2000×1500)
- Details: `assets/<brand>-brand/product-detail-1.png` / `product-detail-2.png`
- Context: `assets/<brand>-brand/product-scene.png`
- Usage: <close-up/rotation/comparison>

### UI Screenshots (Mandatory for Digital Products)
- Home: `assets/<brand>-brand/ui-home.png`
- Core feature: `assets/<brand>-brand/ui-feature-<name>.png`
- Usage: <product showcase/dashboard reveal/comparison>

## 🎨 Supporting Assets

### Palette
- Primary: #XXXXXX  <source annotation>
- Background: #XXXXXX
- Ink: #XXXXXX
- Accent: #XXXXXX
- Forbidden colors: <families the brand explicitly avoids>

### Typography
- Display: <font stack>
- Body: <font stack>
- Mono (for data HUDs): <font stack>

### Signature Details
- <which details receive the “120%” treatment>

### Prohibited Uses
- <explicit prohibitions: for example, no blue for Lovart; no muted warm colors for Stripe>

### Character Keywords
- <3–5 adjectives>
```

**Execution discipline after writing the spec:**
- Every HTML file must **reference** the asset paths in `brand-spec.md`. Never replace them with a CSS silhouette or hand-drawn SVG.
- Reference the genuine logo file through `<img>`; do not redraw it.
- Reference the genuine product image through `<img>`; do not substitute a CSS silhouette.
- Inject CSS variables from the spec: `:root { --brand-primary: ...; }`; HTML should use only `var(--brand-*)`.
- This turns brand consistency from personal discipline into structural enforcement. Adding an improvised color now requires changing the spec first.

##### Fallbacks When the Whole Process Fails

Handle each missing asset independently:

| Missing Asset | Response |
|---|---|
| **No logo can be found** | **Stop and ask the user.** Do not force the design forward; the logo is the foundation of brand recognition. |
| **No product image for a physical product** | First generate with `nano-banana-pro` from an official reference → then ask the user → only then use an honest placeholder, a gray block labeled “Product image pending.” |
| **No UI screenshot for a digital product** | Ask the user for a screenshot from their account → capture a frame from an official demo video. Do not pad the design with a mockup generator. |
| **No color values can be found** | Enter Design-Direction Consultant Mode; recommend three directions and label every assumption. |

**Forbidden:** silently replacing missing assets with CSS silhouettes or generic gradients. This is the protocol's largest antipattern. **Stop and ask instead of padding.**

##### Counterexamples from Real Failures

- **Kimi animation:** color was guessed from memory as orange; Kimi actually uses `#1783FF` blue. The work had to be redone.
- **Lovart design:** the red of Heytea, shown as demo content inside a product screenshot, was mistaken for Lovart's own color and nearly ruined the design.
- **DJI Pocket 4 launch animation (2026-04-20; the incident that triggered this protocol upgrade):** the old process extracted only color values. It did not download the DJI logo or Pocket 4 imagery and substituted a CSS silhouette. The result was a “generic black-background technology animation with an orange accent,” with no DJI identity. The review asked, “Otherwise, what are we communicating?” → protocol upgraded.
- Colors were extracted but never recorded in `brand-spec.md`; by the third slide, the primary value was forgotten and an improvised “close but not exact” hex was added, destroying consistency.
- **Five Coding Agents comparison deck (2026-06-06; the incident that expanded the trigger condition):** the agent classified the task as “PowerPoint + no style references,” entered fallback Design-Direction Consultant Mode, extracted only five brand colors, and spawned three design directions. It obtained **none of the five product logos—Claude Code, Cursor, Codex, Copilot, and Trae**. Review caught it: “Why didn't we retrieve these products' logos?” Root cause: the comparison/list deck was incorrectly considered outside §1.a, which was thought to apply only to “collateral for a single client,” and the fallback path had no logo checkpoint. → Fixes: ① expand the trigger to include both single-brand work and designs naming or comparing real products; ② fallback never waives logo acquisition; ③ add a “named-product logo sub-gate” in Phase 3.5 before spawning; ④ add the reliable svgl / simpleicons / Google favicon chain to Step 3.1.

##### Cost of the Protocol vs. Cost of Skipping It

| Scenario | Time |
|---|---|
| Complete the protocol correctly | Download logo 5 min + download 3–5 product images or UI screenshots 10 min + grep colors 5 min + write spec 10 min = **30 minutes** |
| Cost of skipping it | Produce generic, unrecognizable animation → user spends 1–2 hours revising or rebuilding it |

**This is the least expensive investment in stability.** For commercial work, launch events, and important client projects, thirty minutes spent on the asset protocol is survival money.
