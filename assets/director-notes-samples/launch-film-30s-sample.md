# v5 · "Markdown is the new typewriter."

> Director's Notes for the **markdown-publishing-pipeline v2.0** launch film
> 30 seconds · 1920×1080 · 25 fps · no voiceover
> Director: html-design-studio (acting as Apple-tier launch film director)
> Composer: TBD (target: Max Richter / Ólafur Arnalds / Jóhann Jóhannsson minimal-cinematic register)
> Color base: ivory white #FAFAF6 · ink #1A1A1A · terracotta #C2410C
> Type: Newsreader (display + body) · JetBrains Mono (interface) · Noto Serif SC (Chinese text)

---

## Contents

- [Part I · Director's Statement](#part-i--directors-statement)
- [Part II · Visual System](#part-ii--visual-system)
- [Part III · Story Arc](#part-iii--story-arc)
- [Part IV · Shot-by-Shot Storyboard](#part-iv--shot-by-shot-storyboard)
- [Part V · Production Manifest](#part-v--production-manifest)

---

# Part I · Director's Statement

## 1.1 This is not a feature reel

Most SaaS upgrade videos make the same mistake: they treat the camera like a slide deck. Open → cycle through six features → logo and slogan → end. Every second demonstrates; not one second tells a story. The audience remembers not the product, but another generic launch video that looks AI-generated.

**This film must do something else.**

We have a story to tell. The story has only one line:

> **“md is the source code; everything else is a product.”**

This is not merely a slogan; it is a worldview. Markdown is not just a lightweight document format—it is the source of the writing. Every downstream form—HTML, DOCX, PDF, EPUB—is a product derived from that one source. markdown-publishing-pipeline v2.0 expands the chain from four outputs to six, extending not a feature list but the reach of the source itself.

If the audience remembers only one idea, it should be this: md is the source. Any retained feature detail is a bonus.

## 1.2 The film's visual lineage

Every good launch film is in dialogue with earlier work. This film draws from the following lineage:

**Apple — "Designed by Apple in California" (2013)**

For me, that film remains a benchmark for technology-company storytelling. Director Mark Romanek made three decisive choices:

1. **Pure white backgrounds and serif type** signal a design meditation, not a software demo.
2. **Deliberately slow pacing** keeps each sentence on screen half a beat beyond the audience's natural reading speed, making viewers stay with it.
3. **Jony Ive's near-whispered narration** shares an idea instead of selling a product.

There is no voiceover in our film, so the first two principles must be strengthened to 200% by typography and timing.

**Apple Silicon Launch Films (M1 / M2 / M3, 2020-2024)**

These short films demonstrate that **typography can dance**. “M1” disappears, enlarges, rotates, explodes into dust, and regroups; over 30 seconds, a logo becomes the protagonist of a choreographed performance.

**The hero of this film is not the product UI. It is `md.`—two letters and a terracotta period.** That mark must carry the choreography for all 30 seconds.

**Anthropic Brand Language (2024-2026)**

Anthropic turned terracotta, serif typography, and geometric abstraction into a distinctive visual language for an AI company. It proved that a technology brand can feel as considered as a small philosophy volume from Penguin Classics.

We inherit that palette with **greater restraint**. Anthropic sometimes uses terracotta as a large field; here it remains an accent covering less than 8% of the frame, leaving the rest to ivory and ink.

**Penguin Classics (from 1947, after Romek Marber 1961 grid)**

Penguin demonstrates the confidence of **typography as image**. A cover can consist only of large serif type and a black rule, yet still stop a reader. The 25–29-second slogan reveal borrows that confidence: **ONE SOURCE.** and **SIX FORMS.** are not decoration; they are the frame.

**Pentagram (Paula Scher / Michael Bierut)**

Pentagram's signature is **information architecture**: spacing between text blocks, distance from borders, and ratios between type levels are not arbitrary; they are systematic.

Our grid system (Part II.3) comes from this tradition.

**Kenya Hara "White" (2008)**

Kenya Hara treats white not merely as a color but as a mode of perception.

The real protagonist of this film is not `md.`; it is the ivory white that surrounds it. Leave at least 60% negative space in every shot. Negative space is not "space we have not filled yet"; it is content in its own right.

**Massimo Vignelli — Modernism in design**

Vignelli's principle was simple: “If you can design one thing, you can design everything.”

Our design system does not permit a one-off font or corner radius for an isolated shot. All 13 shots draw from one palette, three typefaces, and four easing curves.

## 1.3 Audience profiles

Three types of audiences, ranked by importance:

**Primary audience A · Existing markdown-publishing-pipeline v1 users (about 60% of traffic)**

They watch to learn what changed. Within 30 seconds, they must understand:

- New capability 5: md → publication-grade PDF
- New capability 6: md → standards-compliant EPUB
- Both outputs offer visibly higher craft than a basic conversion wrapper

→ Shots 08 and 09 receive prominent **★ NEW** labels and destination cards. Professional details—printer's crop marks and an Apple Books-style reader frame—must remain legible so existing users immediately understand that these are serious production capabilities, not checkbox additions.

**Secondary audience B · AI-native creators who know of markdown-publishing-pipeline but have not used it (about 25%)**

Their question is: “Why does this matter to me?” Within 30 seconds, they should realize:

- For articles, research, and white papers, **md can be the source of truth**.
- One command can produce six downstream formats.

→ Shot 04 (anything → md) shows PDF, DOCX, PPTX, XLSX, and HTML being absorbed into md—the visual expression of source-first thinking.

**Extended audience C · Designers, editors, and publishers unfamiliar with the product (about 15%)**

They may simply encounter a beautiful technology short and never explore the product. The film still needs to leave two impressions:

- The work reflects **publishing-grade taste**.
- It looks unlike the generic AI tools they have seen before.

→ The anti-slop checklist in Part II.7 protects this audience's perception. No purple gradients, emoji icons, or AI-drawn SVG characters appear.

## 1.4 Rhythm philosophy

Apple's launch films do not move at a uniform speed. They follow a **slow opening → acceleration → peak → deceleration** curve; see the emotional curve in Part III.

Applied to this film:

- **0–3s · slow opening**: the audience enters; type breathes in character by character.
- **3–6s · first acceleration**: the md mark is born and six file cards fly in.
- **6–22s · sustained acceleration**: six capabilities arrive in sequence, each held long enough to register.
- **22–26s · peak**: the two-line slogan appears as all chrome elements synchronize.
- **26–30s · deceleration**: the capability map fades, leaving the final second to the brand seal and a faint piano reverb tail.

**Key decision**: the climax arrives around 22 seconds, not 29. The final second is resolution. Do not confuse climax with closure.

## 1.5 What this film does **not** do

Ranked by importance:

| Not to do | Reason |
|------|------|
| No purple gradients | A generic shorthand for “technology” that reads as cyber-slop in 2026 |
| No emoji icons | They undermine the intended editorial precision |
| No SVG characters, hands, or abstract humanoids | AI-drawn figures often introduce facial and proportional defects |
| No Inter, Roboto, or Arial for display type | They read as default system choices in this context |
| No cyber-neon or GitHub-dark `#0D1117` background | It would imitate a familiar developer aesthetic instead of defining one |
| No stacks of blur, glow, and particles | One effect can be a decision; repeated effects become visual noise |
| No lorem ipsum | Every simulated text block should contain readable copy, including the hook “md is the source. Everything else is a product.” |
| No stock photos | No real photos appear in the entire film (it's about typography, not lifestyle) |
| No progress bar, timecode, or copyright strip | Those belong to the player and may collide with external playback chrome |
| Do not show md identically in every scene | It should move through distinct states while retaining one recognizable core glyph |

## 1.6 One-sentence positioning

> **"Markdown is the new typewriter."**
>
> A 30-second film about source-of-truth thinking, made for designers who write and writers who design.

---

# Part II · Visual System

## 2.1 Complete color palette

The palette contains ten colors, not three. Every color has a defined role; none is added simply because it looks good in the moment.

```
Name            HEX        Function                                      Maximum frame share
─────────────────────────────────────────────────────────────────────
Ivory Paper    #FAFAF6    Main background; warm ivory                    60–70%
Mist           #F2EDE4    Secondary background; under-card shadow field < 15%
Mica           #E6E1D6    Hairlines, separators, card borders            < 5%
Smoke          #6B6B6B    Secondary text and metadata                    < 5%
Cinder         #3D3530    Secondary dark; warm black-brown               < 10%
Ink            #1A1A1A    Primary dark and primary text                  20–25%
Charred        #2A2620    Near-black brown, used only on cover cards     < 5%
Terracotta     #C2410C    Primary accent                                  5–8%
Terra Hot      #E55D21    Highlight variant; momentary NEW-label flare    < 1%
Terra Deep     #8B2D08    Shadow variant for terracotta projections       < 1%
```

**Non-negotiable rules**:

- No color outside this palette appears in any shot. There is no one-off cool gray for a single scene.
- Terracotta and its two variants together occupy less than 10% of the frame.
- Text uses only Ink, Cinder, Smoke, or Terracotta.

## 2.2 Font system

```
Scale          Font                  Weight    Purpose                         Tracking (em)
────────────────────────────────────────────────────────────────────────────────────
Display XXL    Newsreader            700       Slogan display (200px)             -0.035
Display XL     Newsreader            700       Capability number (48px)           -0.020
Display L      Newsreader            600       Hero md mark (300–480px)           -0.040
Display M      Newsreader            600       Chapter title (32–44px)            -0.015
Body L         Newsreader            400       Essay text (18–22px)                0
Body M (zh)    Noto Serif SC         500       Chinese secondary line (20–26px)   +0.04
Italic         Newsreader italic     400       Quotation or annotation            +0.01
Mono S         JetBrains Mono        500       Label or capability counter        +0.18
Mono XS        JetBrains Mono        700       NEW or version chip (11–14px)      +0.22
Caret          3px block             —         Typing cursor                       —
```

**Font loading strategy**:
- Preconnect to Google Fonts with `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`.
- Request all required weights in one `<link>` to minimize round trips.
- Before MP4 recording begins, wait for `document.fonts.ready`; the Stage implementation already enforces this.

## 2.3 Grid system

**Main canvas**: 1920 × 1080

**Safe margin**: 80px on all sides

**Main content area**: 1760 × 920

**12-column grid**: column width = 132px; gutter = 16px

**Baseline grid**: 8px. All vertical positions use multiples of eight unless a specific optical correction requires otherwise.

**Golden section anchor**:
- upper 1/3 line: y = 360
- lower 1/3 line: y = 720
- middle line: y = 540 (hero md default anchor)
- Upper golden section: y = 412
- Lower golden section: y = 668

**Key safety area**:
- Top 60px: chrome area for the capability counter and version chip
- Bottom 60px: watermark and metadata area
- Central 800×600px: protected content zone; every shot's hero element must remain within it

## 2.4 Animation system

**Easing library**: only these four curves are permitted.

```
Name          Curve formula                         Purpose
──────────────────────────────────────────────────────────────────
expoOut       1 - 2^(-10t)                       Default entrance easing (90% of entries)
overshoot     cubic-bezier(0.34, 1.56, 0.64, 1)  NEW-label and button pop
linear        t                                   Background fades / paper-texture motion
expoIn        2^(10(t-1))                        Exit easing
```

**Duration Dictionary**:

```
Event type                    Duration      Notes
────────────────────────────────────────────────────────
Character stagger              30–50ms       Typing and sequential slogan characters
Small-element entrance         300ms         File card, pill, or chip
Medium-element entrance        500ms         Destination card or capability number
Hero-element entrance          700–900ms     md character morph
Slogan entrance                800ms         Full “ONE SOURCE.” reveal
Scene transition               300ms overlap Cross-dissolve plus scale
Exit                           200–300ms     Always faster than entry
```

**Stagger rules**:

- When multiple elements enter together, delay adjacent elements by 30–80ms—never zero and never more than 100ms.
- 6 pills enter: cumulative stagger 250ms (each 50ms)
- Slogan entrance: about 280ms of total stagger, roughly 30ms × 10 characters

**Transitions between scenes**:

- Always use a **cross-dissolve with a soft scale**; no hard cuts.
- During the outgoing shot's final 300ms: opacity 1 → 0; scale 1 → 0.96.
- During the incoming shot's first 300ms: opacity 0 → 1; scale 1.04 → 1.
- The two shots overlap by 300ms, so the outgoing sprite ends 0.3 seconds after the incoming sprite begins.

## 2.5 Chrome elements (throughout the entire film)

These persistent details make the piece feel like a complete film rather than a sequence of isolated scenes.

**Chrome A · top-left · capability counter (00–22s)**

```
   ┌─────────────┐
   │  ●  CAP·01  │     pulse dot (terracotta) + label
   │  ●●●●○○○○○  │     6-dot progress (filled = current)
   └─────────────┘
```

- Font: JetBrains Mono 12px, letter-spacing 0.24em
- Color: Ink for label, Terracotta for current dot, Mica for upcoming dots
- Animation: at each scene transition, the next dot changes from hollow to solid over 500ms with `expoOut`.

**Chrome B · top-right · version chip (02–30s)**

```
   ╔═════════════════════════╗
   ║ ● MARKDOWN-PUBLISHING · v2.0 ║
   ╚═════════════════════════╝
```

- Font: JetBrains Mono 13px Bold, letter-spacing 0.22em
- Color: Terracotta dot + Ink label
- Entry: 02s overall fade-in 600ms
- Pulse dot: a faint breath every four seconds (opacity 1 → 0.6 → 1 over 1500ms, ease-in-out)

**Chrome C · bottom-center · timeline ticker (07–22s)**

```
   any→md  ━━━━●━━━━━━━━━━━━  md→html  ─  html→md  ─  md→docx  ─  md→pdf  ─  md→epub
```

- Font: JetBrains Mono 11px, letter-spacing 0.18em
- Use Terracotta + bold for the current capability, Smoke for others
- A horizontal line connects 6 names, and the progress point (●) slides from left to right over time
- Entry: 07s fade-in 500ms

**Chrome D · bottom-right · watermark (continuous)**

```
   CREATED BY HTML DESIGN STUDIO
```

- Font: JetBrains Mono 10px, letter-spacing 0.24em
- Color: rgba(26,26,26,0.32)
- Completely static, motionless

**Chrome E · faint paper texture (continuous)**

- SVG noise with an extremely slow 0.3% breathing scale
- opacity ≤ 0.04
- It is almost invisible in the recording, but prevents the frame from feeling inert.

## 2.6 Audio system

### BGM trend (30-second segmented curve)

```
Intensity
 │                            ╱╲
1│                          ╱╱  ╲╲
 │                       ╱╱      ╲╲
 │                    ╱╱             ╲
 │                ╱╱                   ╲
 │            ╱╱                          ╲
 │       ╱╱                                  ╲
 │   ╱╱                                          ╲
0└──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴
   0  2  4  6  8 10 12 14 16 18 20 22 24 26 28 30s
   │  │     │              │           │  │
   Entrance│   String progression │      Rhythm added  │ Peak │  decay
      piano                              swell
```

**Layers** (all run on the 30-second master timeline; envelopes control their intensity):

- **L0 · Room tone** (00–30s): near-subliminal background noise that keeps the film from feeling sterile
- **L1 · Piano single note** (00-08s): A single piano note is continuously struck, once every 1.2 seconds, slowly accumulating
- **L2 · Piano arpeggio** (03-22s): Piano arpeggio enters, giving the feeling of "picking up the rhythm"
- **L3 · Cello drone** (08-22s): low-frequency strings lay the foundation, giving "weight"
- **L4 · Pulse** (15-22s): extremely pianissimo sub-kick, 4/4 rhythm (not dance beat, but cinematic pulse)
- **L5 · String swell** (22–26s): the full string ensemble rises into the climax
- **L6 · Decay + reverb tail** (26–30s): all layers recede, leaving piano and reverberation

**Style Target**: *On the Nature of Daylight* by Max Richter + *Re:member* by Ólafur Arnalds + Jóhann Jóhannsson's *Orphée*

### SFX Dictionary

```
Cue                          Time Type Volume
────────────────────────────────────────────────────────────────────
keyboard click               00.5-02.0   keypress × 12     -18dB each, 30ms
cursor blink                 02.0-02.8   subtle tick        -28dB
md morph swell               02.8-03.2   soft whoosh + bloom -16dB
file card whoosh × 6         05.5-08.0   short whoosh       -20dB each, 200ms
absorb / ink drop             08.0-08.4   "absorb" splash    -16dB
paper rustle                 08.5-09.0   paper turn         -22dB
chime: capability 02 →        09.0       single chime tone  -18dB
chime: capability 03 →        12.0       single chime tone  -18dB
chime: capability 04 →        15.0       single chime tone  -18dB
chime: NEW (05)               18.0       double chime + glow -14dB
chime: NEW (06)               21.0       double chime + glow -14dB
build sweep                  22.0-22.6   ascending sweep    -10dB
impact (slogan ONE)          22.6        deep impact         -8dB
impact (slogan SIX)          23.4        deep impact         -8dB
pen flourish                 24.0-24.4   pen on paper        -22dB
final stamp / sign-off       29.0-29.5   ink stamp           -14dB
```

**SFX band isolation** (prevent fighting with each other):
- BGM accounts for low frequency (40Hz-2kHz)
- SFX whooshes / chimes account for mid-high frequency (2kHz-8kHz)
- SFX impacts account for low frequency sub (40Hz-120Hz) — overlaps with BGM cello but BGM simultaneously ducks -3dB

## 2.7 Anti-AI-slop checklist (per shot)

Each shot must go through this checklist before execution:

```
□  No purple at any saturation
□  No rounded card paired with a left accent border; destination cards may use a neutral Mica border
□  No emoji used as icons
□  No SVG-drawn characters or abstract humanoids
□  No colors outside the Part II.1 palette
□  No Inter, Roboto, or Arial as display type
□  Tracking, line height, and type size come from the Part II.2 system; no arbitrary values
□  Vertical positions follow the 8px baseline unless an intentional optical correction is documented
□  Terracotta occupies less than 10% of the frame
□  The shot contains at least one pause-worthy signature detail that rewards a still frame
□  The transition from the previous shot is cross-dissolve plus scale, not a hard cut
□  The composition makes room for the next shot before ending; it does not remain visually saturated until the final frame
```

---

# Part III · Story Arc

## 3.1 Three-act structure

**ACT I · SET-UP (00.0 — 06.0s)**

The audience enters the film. One question emerges: what is the source of truth?

- SHOT 01 (0.0-1.5s) · BLANK PAGE
- SHOT 02 (1.5-3.0s) · THE CURSOR
- SHOT 03 (3.0-5.0s) · THE TRANSFORMATION
- SHOT 04 (5.0-6.0s) · Enter gathering (overlaps with ACT II)

**ACT II · ESCALATION (06.0 — 22.0s)**

The answer expands: md is the source, radiating into six product pipelines.

- SHOT 04 (5.0-8.5s) · GATHERING (any → md)
- SHOT 05 (8.5-11.5s) · FIRST OUTPUT (md → html)
- SHOT 06 (11.5-14.5s) · REVERSE FLOW (html → md)
- SHOT 07 (14.5-17.5s) · PUBLISHER GRADE (md → docx)
- SHOT 08 (17.5-20.5s) · ★ NEW · PRINT (md → pdf)
- SHOT 09 (20.5-22.5s) · ★ NEW · EBOOK (md → epub, overlaps 0.5s with ACT III)

**ACT III · PAYOFF (22.5 — 30.0s)**

The theme resolves into the slogan and brand seal.

- SHOT 10 (22.5-24.0s) · THE CONVERGENCE
- SHOT 11 (24.0-26.5s) · ONE SOURCE.
- SHOT 12 (26.5-29.0s) · SIX FORMS.
- SHOT 13 (29.0-30.0s) · SIGN-OFF

## 3.2 Emotional curve

```
Emotional intensity
 │                                       ╔═══╗
 │                                    ╔══╝   ╚══╗
 │                              ╔═════╝         ╚══╗
 │                          ╔═══╝                   ╚══╗
 │                       ╔══╝                          ╚══╗
 │                   ╔═══╝                                 ╚════════╗
 │             ╔═════╝                                              ╚══╗
 │       ╔═════╝                                                       ╚══
 │  ╔════╝
 │══╝
 0──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──>
    0     2     4     6     8    10    12    14    16    18    20    22    24    26    28    30s
    │     │     │            │           │            │            │     │     │
    blank cursor morph      gather       cap 02-04   cap 05/06 ★  slogan slogan sign-off
                                                                  ONE   SIX
                                                                  ──────►
                                                                  PEAK 24.5s
```

**Key emotional beats**:
- **02.0s**: First keyboard click → Audience enters
- **03.0s**: the md mark is born → first moment of wonder
- **08.0s**: six file cards collapse into md → realization that md is the source
- **18.0s**: the first NEW label appears → recognition from existing users
- **22.5s**: all chrome collapses before Act III → peak tension
- **24.5s**: SIX FORMS. lands → emotional climax
- **30.0s**: md seal stays quietly → resolution

---

# Part IV · Shot-by-Shot Storyboard

Format of each shot:

```
SHOT NN · NAME
[TIMECODE]  |  FUNCTION
[VISUAL]     Frame composition
[TYPE]       Exact typography specification
[ANIM]       Every element in/out/easing/delay
[AUDIO]      music beat + SFX cue
[CHROME]     Four-corner element status
[ANTI-SLOP]  Passed self-test items
[WHY]        Narrative purpose and handoff
```

---

## SHOT 01 · "BLANK PAGE"

**[TIMECODE]** 00.00 — 01.50s (1.5s) `|` **FUNCTION** Opening. Invite the audience in. Give "empty" some time.

**[VISUAL]**

The entire 1920×1080 frame is Ivory Paper `#FAFAF6`. **Nothing else is visible.**

The only presence is a faint paper texture: SVG noise with an extremely slow 0.3% breathing scale. It is nearly imperceptible, but makes the frame feel like a physical sheet of paper.

Composition: completely empty. In Kenya Hara's sense, white is not an unfinished surface; it is content in its own right.

**[TYPE]** No text.

**[ANIM]**

- 0.00s · paper texture opacity from 0 → 0.04 (500ms linear)
- 0.50–1.50s · Hold the frame with no action, allowing the viewer's eyes to adjust to the white.
- 1.40–1.50s · Prepare a cursor position just left of center (x=860, y=540); it remains transparent until the next shot.

**[AUDIO]**

- BGM: room tone enters (300ms fade-in to -38dB)
- SFX: None

**[CHROME]** All chrome remains hidden.

**[ANTI-SLOP]**

- ✅ No logo, no "Loading...", no brand prefix
- ✅ No gradient, no effects
- ✅ Pause-worthy signature: the paper texture gives the frame material presence without drawing attention to itself.

**[WHY]**

“Designed by Apple in California” also gives emptiness time to register. The opening tells the audience to slow down. If logos and chrome compete for attention immediately, the film will struggle to regain that attention later.

These opening 1.5 seconds are among the film's most important.

---

## SHOT 02 · "THE CURSOR"

**[TIMECODE]** 01.50 — 03.00s (1.5s) `|` **FUNCTION** The typewriter is born; the first content appears.

**[VISUAL]**

Just left of center (x=860, y=540), a vertical 3×56px Ink block begins blinking. After two 0.7-second cycles, `# markdown.md` appears behind it one character at a time in 56px JetBrains Mono, Ink `#1A1A1A`, with `-0.01em` tracking.

Each typed character triggers one keyboard click. After the thirteenth and final character, the cursor blinks once more after `.md`.

**[TYPE]**

- Text: `# markdown.md`
- Font: JetBrains Mono 500 weight
- Size: 56px
- Color: Ink #1A1A1A
- Letter-spacing: -0.01em
- Position: horizontal center, y = 540 (baseline, text vertical center is slightly lower than this)

**[ANIM]**

- 01.50s · cursor block opacity 0 → 1 (200ms)
- 01.50–01.85s · First cursor blink: off 200ms, on 200ms.
- 01.85–02.20s · Second cursor blink.
- 02.20–02.85s · Thirteen characters appear at 50ms intervals. Each fades in while sliding down 1px over 180ms with `expoOut`.
- 02.85–03.00s · One final cursor blink confirms that the mark has been typed.

**[AUDIO]**

- BGM: piano first note at 01.50s (-22dB)
- SFX: keyboard click × 13, once per character, -18dB, 30ms each
- SFX: leave 200ms of silence after the final cursor blink to make room for the morph

**[CHROME]** remains hidden.

**[ANTI-SLOP]**

- ✅ The cursor follows a plausible macOS terminal rhythm rather than a frantic sci-fi flicker.
- ✅ Characters arrive with a real typing cadence rather than appearing all at once.
- ✅ The typeface is JetBrains Mono, not a default Courier or Menlo fallback.
- ✅ Pause-worthy signature: the deliberate 3px cursor width gives the terminal detail physical precision.

**[WHY]**

This shot establishes that **Markdown is not only a noun; it is an action**—typing characters and turning them into structure.

The cursor is the smallest unit of digital writing. Beginning with it stages the birth of the source.

The morph in the next shot is based on the premise that the audience has accepted "we are writing markdown".

---

## SHOT 03 · "THE TRANSFORMATION"

**[TIMECODE]** 03.00 — 05.00s (2.0s) `|` **FUNCTION** Reveal hero. `# markdown.md` morphs into hero `md.`

**[VISUAL]**

At 03.00s, `# markdown.md` begins transforming toward the center.

**morph process** (detailed deconstruction):

- 03.00–03.30s: `#`, `arkdown`, and the extension characters fade out, leaving the central `md`.
- 03.30-04.10s (800ms): The remaining `md` morphs from mono font to Newsreader serif, enlarges from 56px to 480px, changes from Ink to Ink (does not change color), and remains in the same position (still in the center of the screen).
- 04.10-04.80s (700ms): In the lower right corner of the `md` character, a Terracotta period `.` emerges (fade-in + scale 0.6 → 1 + overshoot easing).
- 04.80–05.00s: the period settles and completes the hero mark. A 2px Terracotta rule grows outward from the center to a width of 320px, positioned 30px below.

**End Frame**: `md.` (Newsreader 600 weight, 480px, Ink with Terracotta dot) + a thin line of terracotta orange below. The rest of the screen is completely empty.

**[TYPE]**

- Text: `md.` (`md` in Ink, `.` in Terracotta)
- Font: Newsreader 600 weight
- Size: 480px (display L)
- Letter-spacing: -0.04em
- Color: `m`+`d` Ink #1A1A1A, `.` Terracotta #C2410C
- Centered horizontally and vertically on hero midline (y = 540)
- accent rule 30px below, width 320px (grows from 0)

**[ANIM]**

- 03.00-03.30s · `#` `arkdown` `md` (middle) fade out (opacity 1 → 0, expoOut)
- 03.30–04.10s · `md` morph: `fontFamily` switches, `fontSize` grows 56 → 480, and weight changes 500 → 600 over 800ms with `expoOut`. Use a ghosted overlap, scale, and opacity handoff rather than an abrupt font swap.
- 04.10-04.80s · `.` entrance (700ms overshoot, scale 0.6 → 1)
- 04.80-05.00s · accent rule width 0 → 320px (300ms expoOut)

**[AUDIO]**

- BGM: piano second tone at 03.00s (-20dB), third tone at 04.20s (-18dB) — piano cumulative
- SFX: 03.00-03.20s soft whoosh (when morph starts, -16dB)
- SFX: 04.10s subtle bloom (when the period appears, -20dB)
- SFX: 04.80s short paper rustle (accent rule expansion, -22dB)

**[CHROME]**

- 04.50s · Chrome B (version chip top-right) begins to emerge (fade-in 600ms)
  - Form: `● MARKDOWN-PUBLISHING · v2.0`
  - terracotta dot, mono text, Ink color
  - Entering position: top: 78px, right: 80px
- Still hidden: Chrome A, C, E (visible only ≥ 06s)

**[ANTI-SLOP]**

- ✅ The morph is a genuine glyph transformation with a ghosted overlap, not a simple crossfade.
- ✅ The small Terracotta period is the hero's signature detail and the film's visual anchor. **It remains part of the md mark in every subsequent shot.**
- ✅ The accent rule is structural, not decorative; it returns beneath the Shot 11 slogan to close the visual loop.
- ✅ Pause-worthy signature: at 480px, Newsreader with `-0.04em` tracking brings the m and d close without letting them touch.

**[WHY]**

This is the hero shot: `md.`, the protagonist of the next 25 seconds, is born here.

The design logic is metaphorical: **mono to serif turns “I am typing” into “I am writing.”** Mono evokes the typewriter; serif evokes publishing. Markdown belongs to both worlds: it is typed at a keyboard and serves as the source for publication.

Act II begins after the hero has settled. The mark moves upward to make room for materialized outputs.

---

## SHOT 04 · "GATHERING" (any → md)

**[TIMECODE]** 05.00 — 08.50s (3.5s) `|` **FUNCTION** Reveal capability 01: anything → md. Establish the worldview that md is the source.

**[VISUAL]**

At 05.00s, `md.` moves from the center (y=540) to y=280 while shrinking to 220px.

Six file cards then enter sequentially from below the frame and arc through the lower half (y=520–900) toward the md mark along invisible parabolic paths.

Design of 6 cards (**each is a mini demo of the real file type, not fake bar lines**):

```
.pdf   │ Double column layout + Header "doc.pdf" + Page number "— 12 —" + Several lines of small text with real layout
.docx  │ heading "On Markdown" + Subtitle italic + 6 Line paragraph ascii
.pptx  │ Title "MD AS SOURCE" + simplified bar chart
.xlsx  │ 6×4 spreadsheet grid + sample figures
.epub  │ Apple Books-style page + chapter title "Chapter 01"
.html  │ Browser chrome (three dots + URL bar "example.com") + title + paragraph
```

Each card size is 130×180px, white background + Mica border + 24° upper right corner fold.

**Flight trajectory**: each card starts below the frame at y=1140 and follows a parabola toward the period in the md mark (approximately x=1010, y=370). At mid-frame, the six cards form a fan with 220px between adjacent cards. They are then absorbed into md as scale moves 1 → 0.5, opacity 1 → 0, and position converges on one point.

Absorption timing: starting from 05.60s, one launch every 0.18s. Each flight is absorbed after 1.1s. The last absorb takes about 07.60s to complete.

After absorption completes, the line “Everything → md” appears 60px below the hero in 36px italic serif type.

08.20-08.50s · Overall hold, ready to enter Shot 05.

**[TYPE]**

- Hero `md.`: 220px
- Card internals: JetBrains Mono 12–14px for labels; Newsreader 12–16px for content
- Tagline “Everything → md”: Newsreader Italic 36px, with the arrow in Terracotta
- Chrome A: JetBrains Mono 12px

**[ANIM]**

- 05.00–05.30s · Hero md shrinks and moves upward over 300ms with `expoOut`.
- 05.30s · Chrome A capability counter enters (CAPABILITY · 01 displayed, the first dot is solid)
- 05.60-07.60s · 6 cards are launched in sequence (each launch delay = 5.60 + i × 0.18s, flying 1.1s, absorb at launch+1.1)
- 07.60-08.20s · Tagline "Everything → md" enters (fade-in 400ms + slight y slide 12px → 0)
- 08.20-08.50s · hold

**[AUDIO]**

- BGM: piano arpeggio L2 enters at 05.00s (-26dB → -20dB fade-in)
- SFX: file card whoosh × 6 (once per launch, 200ms each time, -20dB)
- SFX: absorb / ink drop (when the last card is absorbed, -16dB)
- SFX: paper rustle (when tagline enters, -22dB)

**[CHROME]**

- A (top-left capability counter): ON, display `CAPABILITY · 01`, the first dot is solid
- B (version chip): ON, continuously displayed
- C (timeline ticker): OFF (will enter SHOT 05)
- D (watermark): ON, always ON
- E (paper texture): ON

**[ANTI-SLOP]**

- ✅ The six cards are not generic icons; they are miniature, readable demonstrations of their real formats.
- ✅ Parabolic flight suggests gravity; a straight path would feel mechanically interpolated.
- ✅ When it is collapsed, it is "absorbed" (scale + position are closed at the same time), not "superimposed"
- ✅ The md mark needs no glow or particles to explain absorption; motion alone communicates it.
- ✅ Pause-worthy signature: midway through the flight, each card remains distinct and legible enough to identify its file type.
- ✅ The tagline uses the literal `→` character rather than spelling out “to,” preserving Markdown's symbolic language.

**[WHY]**

This is the gateway to Act II. If viewers do not understand that md is the source after these 3.5 seconds, the following shots have no foundation.

There are 3 micro-narrative beats in 3.5 seconds:
1. The hero moves up, making room for its products.
2. Six outputs appear, revealing the system's scope.
3. All return to md: every output begins at the same source.

The next shot enters the forward flow of md → html - the audience has accepted "md is the source" and is now ready to see "how md changes".

---

## SHOT 05 · "FIRST OUTPUT · HTML" (md → html)

**[TIMECODE]** 08.50 — 11.50s (3.0s) `|` **FUNCTION** Capability 02. Establish the ScenePipeline pattern used by the next five shots.

**[VISUAL]**

08.50s: hero `md.` slides from the upper center position to the left side of the screen (x=480, y=540), maintaining the size of 220px.

At the same time, a destination card appears on the right (x=1400, y=540), showing a Tufte-inspired HTML essay.

Destination card design: **real readable content, not placeholder bars**.

```
┌─────────────────────────────────┐
│                                  │
│  On Markdown                     │  ← Newsreader 600, 32px, Ink
│  AN ESSAY · 2026                 │  ← Mono 11px, 0.18em, Smoke
│  ▬▬▬                             │  ← Terracotta rule 60×3px
│                                  │
│  md is the source of truth.      │  ← Newsreader 400, 18px, line-height 1.7
│  Anything else is product.       │
│  We write once. Publish six      │
│  ways. The river forks; the      │
│  spring stays the same.          │
│                                  │
│  ─ studio, 2026.05.11            │  ← italic 14px, Smoke
│                                  │
│  article.html · TUFTE THEME      │  ← Mono 10px, 0.18em, Smoke (bottom)
└─────────────────────────────────┘
   width 480px × height 560px
   white background + Mica border + 24° corner fold
```

A 1.5px Terracotta line grows 380px from the md period toward the destination card, ending with an arrowhead at the card's left edge. The label “md → html” sits 30px above it in 14px Terracotta JetBrains Mono with `0.14em` tracking.

At 09.80s, Chrome C—the timeline ticker—appears for the first time at y=1000.

**[TYPE]**

- See visual description embedded
- label "md → html" font size 14px, Mono Bold, Terracotta, letter-spacing 0.14em
- destination card top chapter title is Newsreader 600, 32px, Ink
- destination card bottom small print mono 10px Smoke 0.18em

**[ANIM]**

- 08.50-08.80s · hero md slide from center-top to left-mid (300ms expoOut)
- 08.80–09.10s · Arrow line grows rightward from the md period, 0 → 380px over 300ms with `expoOut`.
- 09.10s · arrow head emerges (200ms overshoot)
- 09.20-09.40s · label "md → html" enters (fade-in + 8px y slide-down, 300ms expoOut)
- 09.40–10.10s · Destination card enters over 700ms with `expoOut`, scale 0.85 → 1 and opacity 0 → 1.
- 10.10–10.80s · Card internals enter in sequence: title → metadata after 200ms → Terracotta rule after 400ms → six text lines at 60ms intervals → signature after 1000ms → bottom label after 1100ms.
- 10.80–11.50s · Hold with a microscopic breathing scale of 1 → 1.005 → 1. Only half a 600ms cycle is visible in this shot.

**[AUDIO]**

- BGM: cello drone L3 entry at 09.00s (-30dB → -24dB)
- SFX: chime: capability 02 at 09.00s (-18dB)
- SFX: paper rustle (card entry, -22dB)
- SFX: micro ticks (staggered entry, -26dB each)

**[CHROME]**

- A: Advance to `CAPABILITY · 02`, second dot solid
- B: ON
- **C: first appearance** at 09.80s. The progress point sits on the second stop in `any→md  ━━━━●━━━━━  md→html  ─  html→md  ─  md→docx  ─  md→pdf  ─  md→epub`.
- D: ON
- E: ON

**[ANTI-SLOP]**

- ✅ The “On Markdown” essay contains readable English rather than lorem ipsum.
- ✅ The small seal "article.html · TUFTE THEME" is a "detailed signature that can be read when paused"
- ✅ Typography and composition make the md → html conversion clear without glow or particles.
- ✅ The arrow is a solid 1.5px Terracotta line, avoiding the feel of a generic web tutorial diagram.
- ✅ Pause-worthy signature: “AN ESSAY · 2026” uses small caps with `0.18em` tracking, giving the card editorial specificity.

**[WHY]**

This shot establishes the ScenePipeline pattern used by the next five capability scenes:
1. md on the left, destination on the right
2. arrow + label in the middle
3. destination card internal staggered entry (each card has 6-8 text levels)
4. card content is real and readable, not fake bar lines

The audience recognizes the pattern on its second appearance in Shot 06. By Shot 09, repetition creates anticipation—and the NEW label delivers the variation. That recognition-and-change rhythm drives Act II.

---

## SHOT 06 · "REVERSE FLOW · MD" (html → md)

**[TIMECODE]** 11.50 — 14.50s (3.0s) `|` **FUNCTION** Capability 03. Reverse archive: html → md. Establish a two-way flow.

**[VISUAL]**

The shot enters through a cross-dissolve. The previous destination card shrinks and exits toward the lower right from 11.50–11.80s; a new card showing Markdown source enters from the right.

New destination card: a **dark Markdown source view**, contrasting with Shot 05's light HTML output.

```
┌─────────────────────────────────┐
│                                  │  ← background Charred #2A2620
│  # On Markdown                   │  ← Terracotta, mono 14px
│                                  │
│  An essay · 2026                 │  ← Smoke, mono 14px
│                                  │
│  > md is the source.             │  ← italic Smoke, mono 14px
│  > Anything else is **product**. │     `**product**` highlight mica + bold
│                                  │
│  - 1 source                      │  ← mono 14px Smoke
│  - 6 forms                       │
│  - ∞ outputs                     │
│                                  │
│  essay.md · CLEAN MARKDOWN       │  ← bottom Mono 10px Smoke
└─────────────────────────────────┘
   480×560px, Charred background, 24° Cinder corner fold
```

Reverse the arrow: a short Terracotta line runs from the destination card back toward md, with the arrowhead pointing left. The label reads “html → md.”

**Key differences** (form visual rhyme with SHOT 05):
- The destination remains on the right and md on the left, matching Shot 05.
- The arrow reverses to communicate archiving or pulling the content back.
- The dark card creates contrast and identifies the destination as source code.

**[TYPE]**

- Entire card: JetBrains Mono 14px
- Markdown syntax: `#` title in Terracotta; `>` quotation in italic Smoke; `**bold**` in bold Mica; list markers in Smoke
- Bottom label: JetBrains Mono 10px, Smoke

**[ANIM]**

- 11.50–11.80s · Previous card shrinks and exits toward the lower right while md remains.
- 11.80–12.10s · Arrow line grows from right to left over 300ms with `expoOut`.
- 12.10s · arrow head (pointing to the left) emerges
- 12.20-12.40s · Label "html → md" entry
- 12.40-13.10s · New destination card entry (same as SHOT 05 entry logic)
- 13.10-13.80s · 6 lines of staggered entry inside markdown (100ms delay for each line)
  - Micro-detail: each line enters with a character cascade, making the Markdown feel as though it is being written in real time.
- 13.80-14.50s · hold

**[AUDIO]**

- BGM: Sustained L1+L2+L3 layers
- SFX: chime: capability 03 at 12.00s (-18dB)
- SFX: paper rustle (12.40s)
- SFX: Extremely weak keyboard click ticker on each row entry (-26dB each, 100ms apart)

**[CHROME]**

- A: Advance to `CAPABILITY · 03`, third dot solid
- B: ON
- C: progress point slides to the “html→md” position
- D: ON
- E: ON

**[ANTI-SLOP]**

- ✅ This is the film's only dark shot, creating enough contrast to signal source code rather than another output.
- ✅ Syntax highlighting uses the editorial palette—Terracotta, Smoke, and Mica—not a VS Code-style cyber palette.
- ✅ "essay.md · CLEAN MARKDOWN" small print at the bottom → pause-and-look signature
- ✅ The reverse arrow remains a straight line, not a U-turn curve, preserving the established structure.

**[WHY]**

This shot's real function is not simply to demonstrate capability 03; it shows that the pipeline works in both directions.

If all six capabilities radiated outward from md, viewers would read the system as output-only. Reversing the third flow establishes md as the center of the system.

That is why the sequence is 02 (md → html), 03 (html → md), then 04 (md → docx). Placing the reversal third maximizes the surprise of a two-way pipeline.

---

## SHOT 07 · "PUBLISHER GRADE · DOCX" (md → docx)

**[TIMECODE]** 14.50 — 17.50s (3.0s) `|` **FUNCTION** Capability 04. Reveal a publishing-grade DOCX and show that md is not only for programmers.

**[VISUAL]**

Return to a light background and the established left-to-right composition: md on the left, destination on the right.

Destination card: a **publisher-grade DOCX chapter opener**, information-rich but restrained.

```
┌─────────────────────────────────┐
│                       ON MARKDOWN│  ← page header, right-aligned, Smoke italic mono 9px
│  CHAPTER · 01                    │  ← Terracotta mono 11px bold 0.22em
│                                  │
│  On Markdown                     │  ← Newsreader 700, 36px, Ink, lh 1.1
│  A short essay on source-of-truth│  ← Newsreader italic 14px, Smoke
│  thinking                        │
│                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━     │  ← Terracotta full-width rule 3px
│                                  │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬       │  ← 10 lines of mica bar paragraphs
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬           │     (varied widths 76-95%)
│  ...                             │
│                                  │
│                — 1 —             │  ← page number, centered, mono 10px Smoke
└─────────────────────────────────┘
   480×580px, white card, Mica border, 24° corner fold
```

**Special details**:
- The right-aligned running head at the top is the signature detail of a professionally typeset DOCX.
- “CHAPTER · 01” immediately identifies this as a book page rather than an article.
- A 3px full-width Terracotta rule gives the chapter opener a distinctive editorial structure.
- The marks around the page number “— 1 —” are em dashes, not hyphens.

**[TYPE]**

- page header: Newsreader italic 9px, Smoke, letter-spacing 0.14em
- CHAPTER · 01: JetBrains Mono Bold 11px, Terracotta, letter-spacing 0.22em
- main title: Newsreader 700, 36px, Ink, line-height 1.05
- subtitle: Newsreader italic 14px, Smoke
- terracotta rule: 3px thick, full card width
- bar paragraphs: Mica color #E6E1D6, height 6px
- page number: JetBrains Mono 10px, Smoke, letter-spacing 0.18em

**[ANIM]**

- 14.50-14.80s · previous shot card exit + md keep
- 14.80-15.10s · arrow line forward growth
- 15.10s · Arrowhead and “md → docx” label enter.
- 15.30–16.10s · Destination card enters as a whole.
- 16.10-17.00s · internal stagger: page header (delay 0) → CHAPTER mark (delay 100ms) → title (delay 300ms) → subtitle (delay 500ms) → rule (delay 700ms) → 10-line paragraph cascade (delay 850ms + 60ms cascade) → page number (delay 1600ms)
- 17.00-17.50s · hold

**[AUDIO]**

- BGM: continuous; at 15.00s BGM overall swell +2dB (implying that we are advancing towards the climax)
- SFX: chime: capability 04 at 15.00s (-18dB)
- SFX: paper rustle (15.30s)

**[CHROME]**

- A: `CAPABILITY · 04`, the fourth dot is solid
- B/C/D/E: ON

**[ANTI-SLOP]**

- ✅ Do not add a caption explaining that this is a book-page mockup; let the composition communicate it.
- ✅ Use pale Mica bars, not black, to signal an honest layout preview rather than simulated readable content.
- ✅ Pause-worthy signature: the small italic running head will go unnoticed by most viewers but signal publishing experience to designers.
- ✅ This is the most color-saturated capability shot: Terracotta appears in the rule, chapter label, and chrome counter, supporting the climb toward the climax.

**[WHY]**

Capability 04 is a bridge into the new features:

- It confirms that md is not only for the web; it can produce publisher-grade DOCX.
- It establishes the visual language of printed matter, preparing Shots 08 (PDF) and 09 (EPUB).

After this scene, the audience is ready for the md-to-publishing sequence and the NEW labels that distinguish the next two shots.

---

## SHOT 08 · "★ NEW · PRINT" (md → pdf)

**[TIMECODE]** 17.50 — 20.50s (3.0s) `|` **FUNCTION** Capability 05, **NEW**: md → publication-grade PDF. Light the first upgrade signal.

**[VISUAL]**

The shot enters through a cross-dissolve. Its visual intensity is **significantly higher** than Shots 05–07 because the new capability must be remembered.

Visual differences:
1. **NEW label**: a Terracotta outlined box lights up beside the top-left capability counter. It contains “★ NEW” in 13px bold JetBrains Mono with `0.22em` tracking and 6×12px padding.
2. **Two PDF pages fan outward instead of one card**: an A4 page sits behind at +5°, while a 176×240mm Large 32 page sits in front at −3°. The composition communicates support for multiple page sizes.
3. **Each PDF carries printer's crop marks**: a small 2px Smoke L-shape at every corner signals true print production.
4. The arrow and label are both Terracotta rather than Ink, warming the entire scene.

**Two PDF contents**:

PDF A (A4, back):

```
┌──────────────────────────┐
│ ┌                      ┐ │  ← crop marks
│  A4 · 210×297mm           │  ← Mono Bold 10px Terracotta
│  ─── (Terracotta rule)    │
│  On Markdown              │  ← Newsreader 22px
│  ──────────────────       │
│  ▬▬▬▬▬▬▬▬▬▬▬             │  ← 7 lines mica bars
│  ▬▬▬▬▬▬▬▬▬▬▬▬            │
│  ...                      │
│                           │
│ └                      ┘ │  ← crop marks
└──────────────────────────┘
   360×460px, white card, +5° rotation
```

PDF B (Large 32 open, front):

```
┌────────────────────┐
│ ┌                ┐ │  ← crop marks
│  Large32Open · 176×240mm│  ← Mono Bold 10px Terracotta
│  ───                │
│  On Markdown        │  ← Newsreader 19px
│  ──────────         │
│  ▬▬▬▬▬▬▬▬▬▬        │  ← 6 lines mica bars
│  ...                │
│ └                ┘ │
└────────────────────┘
   290×410px, white card, −3° rotation
```

**[TYPE]**

- NEW label: JetBrains Mono Bold 13px, Terracotta, `0.22em` tracking, 1.5px Terracotta border
- Arrow label “md → pdf”: JetBrains Mono Bold 14px, Terracotta, `0.14em` tracking
- PDF spec labels (A4 · 210×297mm, etc.): Mono Bold 10px Terracotta, 0.2em
- Chapter titles inside PDFs: Newsreader 600, 19–22px, Ink

**[ANIM]**

- 17.50-17.80s · Previous shot card exit + md keep
- 17.70s · **NEW label lights up**: scale 0.8 → 1.1 → 1 over 400ms with overshoot easing while a faint Terracotta glow pulses once, then disappears.
- 17.80-18.10s · arrow + label entry (this time with Terracotta accent, emphasizing "this is NEW")
- 18.20–18.60s · Front PDF B enters over 400ms with `expoOut`, scale 0.85 → 1 and rotation −8° → −3°.
- 18.50–18.90s · Rear PDF A follows 300ms later, scale 0.85 → 1 and rotation 0° → +5°.
- 18.90–19.70s · Internal elements of both PDFs enter in cascades.
- 19.70s · PDF B's four crop marks appear at 80ms intervals, completing the print-production detail.
- 19.70-20.50s · hold

**[AUDIO]**

- BGM: percussion pulse L4 joins at 18.00s (-32dB) (very weak sub-kick 4/4 rhythm established)
- **SFX: NEW (05) chime at 17.70s**—double chime with a soft bloom and reverb tail, -14dB. This is one of the film's most important sound cues.
- SFX: paper rustle × 2 (each PDF entry, -22dB each)
- SFX: subtle "ink stamp" at 19.70s (when crop marks appear, -22dB)

**[CHROME]**

- A: `CAPABILITY · 05`, the fifth dot solid
- A: NEW label visible beside the counter
- B: ON; its Terracotta dot pulses in sync to emphasize “new in v2.0”
- C: progress point slides to “md→pdf”; that label grows by 0.5px for emphasis
- D: ON
- E: ON

**[ANTI-SLOP]**

- ✅ The NEW label is a typographic mark—mono, `0.22em` tracking, star, and border—not an emoji or sticker.
- ✅ The two PDFs form a deliberate fan, suggesting the physical act of opening and comparing printed pages.
- ✅ Crop marks communicate print readiness in a single pause-worthy detail.
- ✅ Typography and sound carry the NEW emphasis; no persistent glow or particles are required.
- ✅ Pause-worthy signature: the “Large 32 · 176×240mm” label on PDF B preserves a specific Chinese book trim size instead of reducing print support to generic A4.

**[WHY]**

This is one of Act II's peak shots. Two things must happen simultaneously:
1. The audience must immediately realize that "this is a new feature"
2. Visual detail must show that this is a publication-grade pipeline rather than a basic conversion wrapper.

The NEW label, crop marks, fanned PDFs, and complete A4/Large 32 specifications work together to deliver both messages.

The following EPUB scene is the second NEW shot, with rhythm and emotional intensity raised another step.

---

## SHOT 09 · "★ NEW · EBOOK" (md → epub)

**[TIMECODE]** 20.50 — 22.50s (2.0s) `|` **FUNCTION** Capability 06, **NEW**: md → standards-compliant EPUB 3. Reveal the final capability.

**[VISUAL]**

The shot enters through a cross-dissolve. It lasts **two seconds rather than three** because the NEW-plus-destination pattern is already established; recognition allows the rhythm to accelerate.

Destination card: an **Apple Books-inspired EPUB reader frame**, making the book feel already loaded in a real reader.

```
   ╔════════════════════════════════════╗
   ║ ● ● ●                              ║  ← window chrome (Apple Books)
   ╠════════════════════════════════════╣
   ║                                    ║
   ║  STUDIO · ORANGE BOOK              ║  ← Mono Bold 10px Terracotta 0.22em
   ║                                    ║
   ║                                    ║
   ║  On                                ║  ← Newsreader 700, 30px, Ivory paper
   ║  Markdown                          ║     (on Charred bg)
   ║                                    ║
   ║  ───                               ║  ← Terracotta rule 40×2px
   ║                                    ║
   ║  an essay · Studio                      ║  ← italic 14px Smoke on Charred
   ║                                    ║
   ╠════════════════════════════════════╣
   ║ Apple Books · 1 of 24    EPUB 3   ║  ← Mono 10px Smoke 0.14em
   ╚════════════════════════════════════╝
   460×470px, ivory paper outer + Charred inner book cover area
   2px Ink border, 22px border-radius (modern app frame)
```

**Key visual differences**:
- The outer frame evokes a macOS app window through three traffic-light dots and 22px rounded corners.
- The center contains the open e-book cover on a Charred background with publisher-grade typography.
- The bottom is "Apple Books · 1 of 24" reader chrome
- The full card should feel like a book already open in a polished desktop reader.

**[TYPE]**

- STUDIO · ORANGE BOOK: JetBrains Mono Bold 10px, Terracotta, `0.22em` tracking
- Book title, On Markdown: Newsreader 700, 30px, Ivory on Charred, line-height 1
- Terracotta rule: 40×2px
- Author line: Noto Serif SC italic 14px, Smoke
- Reader chrome: JetBrains Mono 10px, Smoke, `0.14em` tracking

**[ANIM]**

- 20.50-20.80s · Previous shot PDF exit + md keep
- 20.70s · NEW label **remains visible** without another pop animation; Shot 08 already established the behavior.
- 20.80-21.10s · arrow + label "md → epub" entry (Terracotta accent, same as SHOT 08)
- 21.20-21.80s · EPUB destination card overall entry (600ms expoOut, scale 0.88 → 1)
- 21.30-22.00s · Internal staggered: window chrome dots (delay 0) → top brand label (delay 200ms) → book title "On" (delay 400ms) → "Markdown" (delay 480ms) → rule (delay 700ms) → author italic (delay 850ms) → bottom chrome (delay 1000ms)
- 22.00-22.50s · hold + prepare to transition to ACT III

**[AUDIO]**

- BGM: percussion persists, but overall BGM swell +3dB at 22.00s (convergence build-up for SHOT 10)
- **SFX: NEW (06) chime at 20.70s**—double chime, a semitone above Shot 08, -14dB. The interval gives the two NEW shots a musical relationship.
- SFX: window chrome subtle "click" at 21.20s (macOS window appearance, -24dB)
- SFX: page turn rustle at 21.40s

**[CHROME]**

- A: `CAPABILITY · 06`, all six dots solid
- A: NEW label remains beside the counter
- B: version-chip pulse amplitude increases to 1.5×
- C: progress point reaches the rightmost “md→epub” position
- D: ON
- E: ON

**[ANTI-SLOP]**

- ✅ Do not reproduce Kindle or Apple Books branding; use generic macOS-style chrome to imply a reader.
- ✅ No e-ink gray filter (to avoid Kindle slop)
- ✅ “Apple Books · 1 of 24” gives the interface plausible publishing metadata.
- ✅ Pause-worthy signature: the deliberate line break in “On / Markdown” uses 30px Newsreader like an editorial book cover.

**[WHY]**

This shot closes Act II with two requirements:
1. All 6 capabilities are displayed (counter 6/6 solid)
2. The emotional arc begins climbing toward the Act III climax.

Reducing the duration from three seconds to two is deliberate: the rhythm accelerates and signals the approach to the peak.

---

## SHOT 10 · "THE CONVERGENCE"

**[TIMECODE]** 22.50 — 24.00s (1.5s) `|` **FUNCTION** Transition from Act II to Act III. Gather every element and prepare the slogan.

**[VISUAL]**

At 22.50s, all destination cards have exited. Chrome A and C begin fading because the capability counter has reached 6/6 and completed its role.

The md mark moves from x=480 back to the center at x=960 while growing from 220px to 300px.

Six capability labels emerge one by one on a circle of radius 380px around md, spaced every 60° and ordered clockwise from “any→md” at the top. The first four use 14px bold Smoke mono; the two new capabilities use Terracotta.

Overall effect: **md is the sun; the six capabilities are its planets.**

Because it is transitional, the shot should not hold longer than necessary.

From 23.50–24.00s, the six labels fade in a reverse cascade while md remains centered and shrinks to 180px, making room for the slogan.

**[TYPE]**

- 6 capability labels: JetBrains Mono Bold 14px, letter-spacing 0.16em
  - First 4 (any→md / md→html / html→md / md→docx): Smoke
  - Next 2 (md→pdf / md→epub): Terracotta

**[ANIM]**

- 22.50-22.80s · The last EPUB card exits, Chrome A/C fade out (300ms linear)
- 22.50–23.00s · md returns to center and grows over 500ms with `expoOut`.
- 22.80–23.40s · Six labels settle at 60° intervals around md, radius 380px. Stagger by 80ms; fade each over 300ms while sliding 20px outward.
- 23.40–23.80s · Hold with all six labels settled.
- 23.80–24.00s · Fade all six labels over 200ms while md shrinks to 180px with `expoOut`.

**[AUDIO]**

- BGM: at 23.00s, all-layer swell starts (L1+L2+L3+L4 → +4dB)
- BGM: at 23.50s, percussion pauses briefly for 1 beat (tension for sudden silence)
- SFX: 6 capability labels enter with a very weak "click" (-30dB each, staggered)
- SFX: 23.50s starts ascending sweep (build-up to 24.00s)

**[CHROME]**

- A: fade out at 22.50s (counter has been 6/6, mission accomplished)
- B: ON, but start preparing for transition for ACT III (keep the position unchanged, but tighten the internal spacing slightly)
- C: fade out at 22.50s
- D: ON
- E: ON

**[ANTI-SLOP]**

- ✅ The labels settle at fixed positions rather than orbiting like a generic planet spinner.
- ✅ Chrome A and C retire after completing their narrative function, clearing space for the next act.
- ✅ Pause-worthy signature: at 23.40s, all six pipelines are readable clockwise in the film's only complete capability panorama, making it a strong marketing still.

**[WHY]**

This is a bridge.

Act II ends at 22.50s, but the slogan does not enter until 24.00s. Those 1.5 seconds need narrative motion rather than empty waiting.

The convergence returns all six pipelines to md. It condenses the film's central argument: every flow returns to the source.

The next shot gives the frame to the slogan; md is now small enough to become its brand seal.

---

## SHOT 11 · "ONE SOURCE."

**[TIMECODE]** 24.00 — 26.50s (2.5s) `|` **FUNCTION** First half of the Act III peak. Introduce the slogan and enter the emotional climax.

**[VISUAL]**

The md mark remains centered at y=540, reduced to 180px.

At 24.00s, md **continues moving** to the top-left at x=128, y=88 and shrinks to 56px. Fixed there as a brand seal, it reintroduces the product identity without competing with the slogan.

At 24.20s, the first slogan line begins appearing at y=460:

```
ONE SOURCE.
```

Font: Newsreader 700, **168px**, letter-spacing -0.03em, line-height 0.95, Ink #1A1A1A
Position: horizontally centered at x=960; baseline y=460

Entrance: a **staggered letter reveal**. Characters enter 30ms apart, each fading while sliding down 12px and scaling 0.92 → 1 over 260ms with `expoOut`.

26.00s: A short Terracotta rule (320×3px) appears 30px below the slogan, expanding from the center to both ends (300ms expoOut).

26.50s: Enter the next shot.

**[TYPE]**

- ONE SOURCE.: Newsreader 700, 168px, Ink, `-0.03em` tracking, line-height 0.95
- terracotta rule: 320×3px, centered, accent

**[ANIM]**

- 24.00–24.30s · md moves to the top-left and shrinks 180 → 56 over 300ms with `expoOut`.
- 24.20s · The first character of ONE SOURCE., “O,” enters over 260ms with `expoOut`.
- 24.23s · 'N' entry
- 24.26s · 'E' entry
- 24.29s · space (no vision, but layout occupancy)
- 24.32s · 'S'
- 24.35s · 'O'
- 24.38s · 'U'
- 24.41s · 'R'
- 24.44s · 'C'
- 24.47s · 'E'
- 24.50s · '.' (period)
- 24.20–25.00s · The full ONE SOURCE. reveal completes in roughly 560ms.
- 25.00–26.00s · Hold so the audience can read “ONE SOURCE.”
- 26.00-26.30s · Terracotta rule appears (300ms expoOut from 0 → 320px)
- 26.30-26.50s · hold

**[AUDIO]**

- BGM: The swell starting at 22.00s reaches peak at 24.50s (loudest -6dB)
- BGM: the full string ensemble enters at L5, layering cello, violin, and viola.
- **SFX: ONE slogan impact at 24.20s**—deep bass with a short reverb tail, -8dB. This is the film's strongest SFX cue.
- SFX: extremely light pen-on-paper stroke at 26.00s (when rule appears, -22dB)

**[CHROME]**

- A: OFF (retired)
- B: ON, with an **important change**. Cross-dissolve the version chip into a slightly larger form in the same top-right position: 18px instead of 16px, with twice the Terracotta-dot pulse amplitude to emphasize the v2.0 moment.
- C: OFF (retired)
- D: ON
- E: ON

**New chrome**:
- The 56px md mark settles in the top-left as the brand seal.

**[ANTI-SLOP]**

- ✅ The slogan enters letter by letter rather than fading as one block.
- ✅ A 30ms stagger is long enough to reveal the cascade without slowing the rhythm; 60ms would feel labored.
- ✅ The 168px size balances impact with the space required for SIX FORMS. in Shot 12.
- ✅ Pause-worthy signature: the Terracotta period in “ONE SOURCE.” echoes the period in md, maintaining one brand signature across scales.

**[WHY]**

This is the first half of the emotional climax.

"ONE SOURCE." is the thesis of this film. If the audience only remembers one sentence after watching the entire film, it is this sentence.

Moving md to the top-left is strategic: the slogan becomes the protagonist while md remains present as a seal. The two do not compete.

When SIX FORMS. lands in the next shot, the thesis becomes complete.

---

## SHOT 12 · "SIX FORMS."

**[TIMECODE]** 26.50 — 29.00s (2.5s) `|` **FUNCTION** Second half of the Act III peak. Complete the slogan, reveal the capability map, and resolve the film emotionally.

**[VISUAL]**

26.50s: ONE SOURCE. Still at the top of the screen (y=460).

The second hero line begins entering at y=720:

```
SIX FORMS.
```

Font: Newsreader 700, 168px, letter-spacing -0.03em, line-height 0.95, **Terracotta #C2410C**
Position: horizontally centered at x=960; baseline y=720

Entrance mirrors Shot 11: a staggered reveal at 30ms intervals, including the final period.

Each character fades in while **sliding up** 12px—the mirror image of Shot 11's downward motion—and scaling 0.92 → 1 over 260ms with `expoOut`.

At 27.20s, SIX FORMS. completes the two-line slogan.

27.20-27.80s: At 30px below SIX FORMS., 6 capability pills appear, entering in order:

```
[any→md] [md→html] [html→md] [md→docx] [md→pdf ★NEW] [md→epub ★NEW]
```

Each pill:
- Font: JetBrains Mono Bold 14px, letter-spacing 0.16em
- Size: 10px×18px padding, 1.5px border
- First 4: Ink text + Ink border + transparent background
- Next 2 (NEW): Terracotta text + Terracotta border + Mist (#FFF7F0) background + Terra Hot "NEW" mini badge at -8/-10px in the upper right corner

Use 14px between pills. Center the complete row at x=960, y=820.

The pills enter left to right at 80ms intervals, each fading while sliding up 4px over 300ms with `expoOut`.

From 27.80–28.30s, the supporting line enters at y=890:

```
md is the source code; everything else is a product.
```

Font: Noto Serif SC italic 26px, Ink, letter-spacing 0.04em
Horizontally centered.

Entry: fade-in + 8px y slide-up (400ms expoOut).

From 28.30–29.00s, hold the complete composition. This is the film's most static frame, giving the audience time to read.

**[TYPE]**

- SIX FORMS.: Newsreader 700, 168px, Terracotta, `-0.03em` tracking, line-height 0.95
- Pills: JetBrains Mono Bold 14px, `0.16em` tracking, 1.5px border
- Sublabel: Noto Serif SC italic 26px, Ink, letter-spacing 0.04em

**[ANIM]**

- 26.50-27.20s · SIX FORMS. Character stagger (same as SHOT 11 mirror)
- 27.20-27.30s · short hold
- 27.30-27.80s · 6 pills cascade (stagger every 80ms × 6 = 480ms total + 300ms each pill duration)
- 27.80–28.30s · Supporting line enters over 400ms.
- 28.30-29.00s · Overall hold

**[AUDIO]**

- BGM: 26.50s peak swell, reaching the loudest (-4dB) in the film at 27.20s
- BGM: after 27.20s, sustain the established peak without increasing intensity further.
- **SFX: SIX slogan impact at 26.50s**—deep bass, −7dB, a semitone heavier than the ONE impact.
- SFX: 6 pills entry staggered metallic clicks (-24dB each, 50ms)
- SFX: faint pen flourish at 27.80s as the supporting line enters

**[CHROME]**

- B: ON, version chip sustained
- D: ON, watermark continuous
- E: ON
- md seal (top-left): ON

**[ANTI-SLOP]**

- ✅ ONE SOURCE. uses Ink and SIX FORMS. uses Terracotta; the contrast encodes source versus outputs rather than adding decoration.
- ✅ The two NEW pills use a restrained `#FFF7F0` tint rather than a saturated orange fill.
- ✅ Each 9px NEW badge overlaps the pill's top-right corner by 8–10px, a precise but unobtrusive signature detail.
- ✅ The English supporting line uses English punctuation consistently.
- ✅ The complete 28.30s frame can serve as a thumbnail, X poster, or social-media cover: it contains the slogan, six capabilities, supporting line, brand seal, and version.

**[WHY]**

This is the resolution shot.

If Shot 11 states the thesis—ONE SOURCE.—Shot 12 supplies its completion: SIX FORMS. plus the capability map.

At 27.50s, typography and the string peak should fully absorb the audience. This is the film's most valuable five-second stretch.

The final shot lets the strings decay and leaves the md seal alone.

---

## SHOT 13 · "SIGN-OFF"

**[TIMECODE]** 29.00 — 30.00s (1.0s) `|` **FUNCTION** End. Let all slogan elements retire, leaving the md seal to shine alone. Brand imprint.

**[VISUAL]**

At 29.00s, SIX FORMS., the six pills, and the supporting line remain held in place.

From 29.20–29.60s, ONE SOURCE., SIX FORMS., the pills, and the supporting line fade together over 400ms with **no stagger**, allowing the frame to settle.

At 29.40s, the top-left md seal grows from 56px to 88px while moving from (128, 88) to the center at (960, 540)—the final return of md.

From 29.40–29.80s, the 88px md mark settles at center in Ink with a Terracotta period.

From 29.80–30.00s, a 120×2px Terracotta rule grows 30px below md. It is shorter and more delicate than the Shot 03 rule.

At 30.00s, all elements are in place. The final frame is:

```
                                                                  ● MARKDOWN-PUBLISHING · v2.0
                                                                                              (top-right chrome)


                                            md.                   ← Newsreader 600, 88px, Ink + Terracotta dot
                                          ───                     ← Terracotta rule, 120×2px

                                                                                CREATED BY HTML DESIGN STUDIO
                                                                                              (bottom-right watermark)
```

The final frame contains only four elements: md seal, accent rule, top-right version chip, and bottom-right watermark. Everything else is empty.

**[TYPE]**

- md.: Newsreader 600, 88px, Ink with a Terracotta period
- accent rule: 120×2px Terracotta

**[ANIM]**

- 29.00–29.20s · Hold the previous composition long enough to register.
- 29.20–29.60s · ONE SOURCE., SIX FORMS., the six pills, and the supporting line fade together over 400ms, linear.
- 29.40-29.80s · md seal enlarge + slide to center (400ms expoOut, size 56 → 88, position (128,88) → (960,540))
- 29.80-30.00s · accent rule expand (200ms expoOut, 0 → 120px)
- 30.00s · final hold (if there is a loop, loop back to 00.00s)

**[AUDIO]**

- BGM: 29.00s starts decay and enters L6 (all layers fade out)
- BGM: 29.40s strings fade, leaving piano + reverb tail
- BGM: 30.00s, everything returns to silence + room tone
- **SFX: final stamp/sign-off at 29.40s**—ink stamp with soft reverb, -14dB, as md settles at center.
- SFX: extremely light paper rustle at 29.80s (accent rule entry)

**[CHROME]**

- B: ON, continuous
- D: ON, continuous
- E: ON, continuous
- All others OFF

**[ANTI-SLOP]**

- ✅ No sign-off text such as "Thank you" or "Made with love" (cheap)
- ✅ Do not enlarge the brand mark excessively.
- ✅ The md seal is the story's protagonist; leaving it alone at center is the simplest possible resolution.
- ✅ Pause-worthy signature: in the 88px Newsreader mark, the Terracotta period draws the eye first, followed by the accent rule and then the top-right version chip. That sightline confirms the hierarchy.
- ✅ The last 0.2 seconds of silence restores breathing room.

**[WHY]**

The film begins with a blank page and ends with an md seal plus one touch of Terracotta.

This is the visual rhyme:
- 0.0s: blank ivory page (empty)
- 30.0s: ivory page + md (full)

The audience travels from empty to full, yet “full” contains only `md.`. That is the visual statement of source-of-truth thinking: **everything begins with a simple md.**

If the audience remembers only one frame, it should be this one.

---

# Part V · Production Manifest

## 5.1 Font list + loading method

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@400;500;700&family=Noto+Serif+SC:wght@400;500;700;900&display=swap" rel="stylesheet">
```

**Expected loading time**: roughly 800–1500ms, depending on CDN conditions. Await `document.fonts.ready` before starting the Stage timer; the implementation already does this.

## 5.2 Color palette CSS variables

```css
:root {
  --paper:       #FAFAF6;
  --mist:        #F2EDE4;
  --mica:        #E6E1D6;
  --smoke:       #6B6B6B;
  --cinder:      #3D3530;
  --ink:         #1A1A1A;
  --charred:     #2A2620;
  --terracotta:  #C2410C;
  --terra-hot:   #E55D21;
  --terra-deep:  #8B2D08;
}
```

## 5.3 BGM source selection criteria

**Preferred**: generate a 30-second minimal cinematic piece with Suno or Udio using a prompt such as:

```
minimal cinematic piano, slow tempo 60bpm, single piano notes,
sparse arpeggio, low cello drone, subtle sub-kick percussion,
swelling strings at climax, decay to silence,
restrained contemporary neoclassical atmosphere,
no vocals, 30 seconds duration, ivory paper mood
```

**Alternative**: Search copyright-free library
- artlist.io: "minimal cinematic"
- bensound.com: "cinematic"
- musicbed.com: "Jóhann Jóhannsson style"

**Minimum standard**: 30-second duration, 44.1kHz sample rate, and approximately -16 LUFS integrated loudness.

## 5.4 SFX sources

**Preferred**: use the prepared resources under `assets/sfx/<category>/*.mp3`:

```
Event Recommended SFX File
─────────────────────────────────────────────────────
keyboard clicks            sfx/ui/keyboard-click-*.mp3
cursor blink               sfx/ui/tick-soft.mp3
md morph swell             sfx/cinematic/whoosh-bloom.mp3
file card whoosh           sfx/cinematic/whoosh-short-*.mp3
absorb / ink drop          sfx/foley/ink-drop.mp3
paper rustle               sfx/foley/paper-turn.mp3
chime capability           sfx/melodic/chime-single-*.mp3
chime NEW (double)         sfx/melodic/chime-double-warm.mp3
build sweep                sfx/cinematic/ascending-sweep.mp3
impact (slogan)            sfx/cinematic/deep-impact-*.mp3
pen flourish               sfx/foley/pen-stroke.mp3
final stamp                sfx/foley/ink-stamp.mp3
```

## 5.5 Screenshot verification plan

The following keyframes must be verified (with Playwright + `?t=NN` URL parameters) after implementing HTML:

```
t=0.5    ← SHOT 01 mid: blank ivory page (paper texture remains unobtrusive)
t=2.5    ← SHOT 02 mid: typing in progress (cursor blink + JetBrains Mono)
t=3.8    ← SHOT 03 mid: md morphing (ghost overlap + scale curve)
t=5.0    ← SHOT 03 end: hero md settled (480px + Terracotta period)
t=7.0    ← SHOT 04 mid: cards in flight (parabolic paths + readable card content)
t=8.4    ← SHOT 04 tagline (“Everything → md” in italic serif)
t=10.5   ← SHOT 05 mid: HTML card complete (essay content readable)
t=13.5   ← SHOT 06 mid: md source visible (syntax highlighting)
t=16.5   ← SHOT 07 mid: DOCX page complete (chapter title + page number)
t=19.0   ← SHOT 08 mid: PDFs fanned out (crop marks visible)
t=21.5   ← SHOT 09 mid: EPUB frame complete (reader chrome)
t=23.4   ← SHOT 10 mid: all six capability labels visible
t=25.0   ← SHOT 11 mid: ONE SOURCE. complete (word spacing + Terracotta period)
t=27.5   ← SHOT 12 mid: SIX FORMS. + pills (complete two-line slogan)
t=28.5   ← SHOT 12 marketing frame (complete marketing-ready composition)
t=29.9   ← SHOT 13 final hold (md seal + accent rule)
```

Each frame must meet:
- No element overflow 1920×1080 canvas
- Kerning, line height visually correct
- Anti-AI-slop checklist passed
- Key typography details (such as Terracotta dot, page number em-dash, chapter title small caps) are identifiable

## 5.6 Recording parameters

```bash
node scripts/render-video.js \
  --file file:///path/to/v5-six-forms.html \
  --duration 30 \
  --fps 25 \
  --width 1920 \
  --height 1080 \
  --out v5-final-silent.mp4
```

**Key codec parameters**:
- video codec: libx264
- pixel format: yuv420p (compatibility)
- bitrate: 12 Mbps (high quality, 30s file is about 45MB)
- profile: high
- preset: slow (quality > speed)

**Subsequent frame insertion** (optional, 60fps smooth version):

```bash
bash scripts/convert-formats.sh v5-final-silent.mp4 --fps 60
```

## 5.7 Audio mixing

```bash
# Step 1: Add BGM
bash scripts/add-music.sh v5-final-silent.mp4 \
  --bgm assets/bgm/cinematic-minimal-30s.mp3 \
  --bgm-volume -18dB \
  --out v5-with-bgm.mp4

# Step 2: Add SFX cues (add each cue according to the SFX dictionary in Part II.6)
# Mix multiple streams with ffmpeg's -filter_complex amix
ffmpeg -i v5-with-bgm.mp4 \
  -i assets/sfx/ui/keyboard-click-1.mp3 \
  -i assets/sfx/ui/keyboard-click-2.mp3 \
  ... \
  -filter_complex "[1]adelay=500|500[s1];[2]adelay=550|550[s2];...;[0][s1][s2]...amix=inputs=N:duration=longest:dropout_transition=0[out]" \
  -map 0:v -map "[out]" \
  -c:v copy -c:a aac -b:a 192k \
  v5-final.mp4

# Step 3: Validation audio stream
ffprobe -i v5-final.mp4 -show_streams -select_streams a 2>&1 | grep -E "(codec_type|sample_rate|channels|duration)"
```

**Expected output**:
- audio codec: aac
- sample rate: 44100Hz or 48000Hz
- channels: 2 (stereo)
- duration: 30.0s

## 5.8 Deliverables list

```
v5-final.mp4              main delivery (30s, 1920×1080, 25fps, with audio, ~50MB)
v5-final-60fps.mp4        high-frame-rate version (60fps interpolation, ~80MB, for X / YouTube)
v5-final.gif              social-media version (30s, optimized palette, <8MB, for WeChat article embedding)
v5-final-silent.mp4       silent master for alternate music or later dubbing
v5-poster.png             poster frame captured at t=28.5s, for an X card or social-media cover
v5-director-notes.md      this document
v5-six-forms.html         source file (HTML animation)
v5-shot-list.csv          shot timecodes and key parameters for verification
```

## 5.9 End-to-end time estimate

| Step | Estimated time |
|-----|----------|
| Director's notes | Complete |
| HTML animation implementation | 4-6 hours |
| Keyframe screenshots + visual verification | 1 hour |
| Record silent MP4 | 5–10 minutes with Playwright |
| BGM generation/selection | 30 minutes |
| SFX cueing and mix | 2–3 hours |
| GIF derivative | 5 minutes |
| Poster capture and naming | 10 minutes |
| Final delivery + git commit | 10 minutes |
| **Total** | **8–11 hours** |

---

# Appendix · The first principle of this film

If the director's statement had to be reduced to one sentence, it would be:

> **A typographic film about the source, with `md.` as its protagonist.**

All other design decisions—swatches, fonts, rhythm, SFX, chrome, anti-slop checklist—derive from this one sentence.

If a specific decision cannot be traced back to this sentence, don't do it.

---

*Director's notes — end of document*
*Approximate source length: 11,500 Chinese characters*
*Next step: begin HTML implementation after the user approves these notes.*
