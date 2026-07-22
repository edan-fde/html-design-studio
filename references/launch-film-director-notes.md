# Launch-Film Workflow · Write the Director's Notes Before Animating

> Standard workflow for high-end visual work lasting at least 20 seconds, carrying a brand narrative and slogan reveal, and potentially distributed on X, WeChat Official Accounts, or Bilibili.
>
> Trigger condition: The task is a "product upgrade film / brand launch film / launch trailer / Super Bowl-tier ad / brand campaign / hero animation video", and **the user has clear expectations for quality** (such as "Super Bowl quality", "10x detail", or "Apple-level").
>
> Do not use this process for a quick animation demo, simple motion graphic, or single-icon animation; it would be over-engineering.

---

## 1. Why write director's notes first

Practical lessons (2026-05-11 huashu-md-html v2.0 project):

The first attempt went straight into HTML. The result was animation from a programmer's perspective: every capability received equal emphasis, the rhythm was uniform, the slogan was tacked on at the end, and there was no narrative arc. For the second attempt, the user said: “Stop. Write a long-form storyboard of roughly 10,000 Chinese characters from the perspective of an Apple director.” That produced `v5-director-notes.md`—about 11,500 Chinese characters and a 13-shot specification. Implementing from that document succeeded in one pass: every paused frame held attention, and the pacing built through rises, falls, and a clear climax.

**Core difference**: use the script to think and the HTML to execute. Once the thinking is complete, implementation becomes faithful translation. Start with implementation and every shot becomes an improvised decision; the result will inevitably feel incoherent.

Writing director's notes is not playacting. It externalizes every visual decision before production: each shot has been visualized, justified, and connected to its context. HTML implementation should then require no new creative decisions—only faithful execution.

---

## 2. Trigger test (ask three questions first)

Ask before starting the launch film workflow:

1. **Must the film carry the brand narrative?** (A thesis, slogan reveal, or ceremonial sense of upgrade.) Yes → follow the director's-notes process
2. **Are viewers likely to pause?** (To capture a still, make an X post or cover, or inspect details.) Yes → every frame must withstand scrutiny
3. **Has the client named a reference they want to resemble?** (Apple, Anthropic, Nike, Penguin, or a specific director.) Yes → establish the visual context explicitly

If any one is "Yes", go through the process. If all three are "no", skip it and use the standard process of [animations.md](animations.md) directly.

> 🔴 **Prerequisite gate**: The launch film must first pass the three-direction gate in `SKILL.md`: one direction board per route, each containing a real rendered hero keyframe, color board, one-sentence mood statement, and references. Write the director's notes only after the user selects a direction. A style phrase such as “Apple-level” does not waive this requirement (validated in production by HuaStudio on 2026-07-18).

---

## 3. The five-part structure of director's notes

The director's notes—10,000–12,000 Chinese characters in the source workflow, or a comparable level of detail in English—must contain all five parts below. The figures below are Chinese-character budgets, not English word counts. **Omitting any part makes the document incomplete and degrades the result.**

### Part I · Director's Statement (about 1,500–2,000 Chinese characters, or comparable English detail)

Answer 5 questions:

1. **What is this film not?** State explicit exclusions, such as “This is not a feature walkthrough” or “This is not a demo.”
2. **Core thesis line**—What single sentence should the audience remember after watching?
3. **Which creative context is it in conversation with?** List 5–8 visual references—director, designer, brand, photographer, work title, and year—and state exactly what each contributes
4. **Three audience portraits + a commitment to each**: primary, secondary, and broader audience; give each one a paragraph
5. **Rhythm philosophy**—describe the slow beat → acceleration → peak → slow resolution curve, and identify the exact second of the emotional climax (**not necessarily the final second**)

End with an anti-slop checklist: **things this film does not do**. Be specific, not vague.

### Part II · Visual System (about 1,500–2,500 Chinese characters, or comparable English detail)

This is an engineered visual specification. Once complete, any competent implementer should be able to produce a consistent result from it.

Required subsections:

- **Complete color palette**: at least 8–10 colors, each with a HEX value, defined role, and maximum share of the frame
- **Type system**: at least six size levels, each specifying typeface, weight, size, tracking, and role
- **Grid system**: canvas size + margin + column grid + baseline grid + key safe zone + golden section anchor point
- **Animation system**: easing library (within 4 items) + duration dictionary + stagger rule + scene transition rule
- **Chrome elements**: recurring details such as counters, chips, tickers, watermarks, and textures; specify position and entrance/exit timing for each
- **Audio system**: BGM 30-second trend curve (layered) + SFX dictionary (10+ cues including time code + volume + frequency band isolation)
- **Anti-AI slop checklist**: per-shot self-check list (10-15 items)

Non-negotiable rule: **derive every visual decision from the Visual System; never invent new values ad hoc in the shot list.**

### Part III · Story Arc (about 500–800 Chinese characters, or comparable English detail)

Three-act structure + emotion curve:

- **Act I · SETUP** (the first fifth of the runtime, e.g. 0–6s in a 30s film): the audience enters and the question is raised
- **Act II · ESCALATION** (middle 2/3): answers unfold, theme laid out
- **Act III · PAYOFF** (last 1/4): sublimation, slogan reveal, brand seal

Include an ASCII emotion curve and mark the exact climax.

**Key decision**: the climax does not need to occur at the end. In a 30-second film, it usually lands around 22–25 seconds, not second 29. The final seconds are resolution and decay, not the peak. Ignoring this produces an anticlimactic ending.

### Part IV · Shot-by-Shot Storyboard (about 5,000–7,000 Chinese characters, or comparable English detail · 60% of the length)

Each shot contains 10 fields (all are indispensable):

```
SHOT NN · NAME
[TIMECODE]    Start and end time + Duration
[FUNCTION]    This shot's role in the story arc (one sentence)
[VISUAL]      Composition + element positions + direction of motion
[TYPE]        Exact type specification (family / size / tracking / line height / color / alignment)
[ANIM]        Per-element entrance/exit timing + easing + duration + stagger + delay
[AUDIO]       Music beat + SFX cues (map every shot to the BGM rhythm and include an SFX schedule)
[CHROME]      State of all four corner elements (present / fade in or out / pulse)
[ANTI-SLOP]   Checklist items passed + the shot's “120% detail” signature
[WHY]         How it continues the previous shot and creates a hook into the next
```

**Source-density guide: average 30–80 Chinese characters per field → 400–700 Chinese characters per shot → 12–15 shots → 5,000–7,000 Chinese characters. In English, preserve the same decision density rather than treating these figures as word counts.**

Production test: **read the storyboard back and ask whether the film still works if any one shot is removed.** If it does, that shot is redundant and should be cut.

### Part V · Production Manifest (about 800–1,200 Chinese characters, or comparable English detail)

Production and delivery checklist:

- Font loading URL (including preconnect)
- CSS variables (ready to paste)
- BGM selection criteria, a Suno/Udio prompt, and alternative music libraries
- SFX dictionary (list file path by timecode cue + volume)
- **Keyframe verification plan**: 12–15 pause-and-check timecodes, each with explicit verification targets such as fonts, positions, and chrome state
- Recording parameters (fps / codec / bitrate / preset)
- ffmpeg audio mixing command (with audio stream verification)
- Deliverable list (mp4 / mp4-60fps / gif / poster.png / silent.mp4 / shot-list.csv)
- End-to-end time estimate, accurate to the hour

---

## 4. Five rules for writing director's notes

**4.1 Use the director's tone, not the PM's tone**

❌ “This shot displays the product features.”
✅ “This is the hero shot—if the audience pauses anywhere, I want it to be here.”

The notes are for the implementer, but also for your future self. First-person judgments preserve far more decision-making context than neutral descriptions.

**4.2 Cite specific works (including year), not just genre names**

❌ “Apple-inspired”
✅ "Apple 'Designed by Apple in California' (2013, dir. Mark Romanek) — I learned slow beat + serif + white background"

Citing a specific work has three benefits: anyone can look it up for comparison; it forces you to identify the exact technique you are borrowing; and it prevents vague, unaccountable “inspiration.”

**4.3 Trace every decision to the first principle**

The film needs one first principle, such as “Markdown is the new typewriter.” Every decision—color, type, tempo, chrome—must trace back to that sentence. If it cannot, it is decoration; remove it.

**4.4 Writing the anti-slop rules matters more than listing what to do**

The "things this film does not do" list (purple gradient / emoji / Lorem ipsum / Inter display / SVG drawing characters / rounded corners card + left border accent) can protect quality better than the "things this film does" list.

There are infinitely many valid positive choices, but only a finite set of disqualifying mistakes. Violate that negative checklist and the work immediately reads as slop.

**4.5 Do not implement immediately—set the notes aside, then reread them after 30 minutes**

While drafting, production momentum can hide inconsistencies. Re-reading the storyboard every 30 minutes reveals:
- The functions of some two shots are repeated (delete one)
- The narrative jump of a certain shot is too big (add a transition)
- The emotional climax is in the wrong position (move)
- The number of chrome elements and shots does not match (realign)

That 30-minute pause can save two hours of rework.

---

## 5. Director's Notes → HTML implementation process

Once the director's notes are complete, implement the HTML in this order:

1. **Reuse starter components** (Stage/Sprite/Easing/interpolate of `assets/animations.jsx`) - no reinvention
2. **CSS variables pasted directly from Visual System Part II** - no temporary color changes in HTML
3. **Match each Sprite's start/end times to the Part IV timecodes**—do not add shots without authorization
4. **Extract chrome into independent components** (`ChromeA/B/C/D`) and drive their states with `useTime()`
5. **Destination cards must contain real, readable content**, not fake bars. This was the most frequently cited “120% detail” signature in the v5 project
6. **Capture and verify keyframes immediately after implementing each shot** using `?t=NN` and Playwright; do not wait until the whole film is complete

---

## 6. Keyframe verification process

URL-parameter implementation (add this to the Stage component):

```js
const urlMatch = window.location.search.match(/[?&]t=([\d.]+)/);
const frozenTime = urlMatch ? parseFloat(urlMatch[1]) : null;
const [time, setTime] = useState(frozenTime != null ? frozenTime : 0);
const [playing, setPlaying] = useState(frozenTime == null);
```

This lets `file:///path/animation.html?t=14.5` open directly on a frozen frame at 14.5 seconds.

Batch screenshots:

```bash
for t in 0.5 2.5 4.9 7.0 10.5 13.5 16.5 19.0 21.5 23.4 25.5 28.0 29.9; do
  npx -y playwright screenshot \
    "file://$PWD/animation.html?t=$t" \
    "keyframes/t-$t.png" \
    --viewport-size=1920,1136 \
    --wait-for-timeout=2500
done
```

Each screenshot must be verified:
- [ ] No elements overflow the 1920×1080 canvas
- [ ] Tracking and line height are visually correct: neither cramped nor loose
- [ ] Key typography details (period color / em dash / italic / small caps) are identifiable
- [ ] chrome element position + status correct
- [ ] anti-AI slop checklist passed
- [ ] A “pause-and-look” detail worth inspecting is present

---

## 7. Multi-perspective parallel strategy (advanced)

For a complex project—when the launch-film direction is unresolved, several distinct aesthetics need comparison, or the client has no style preference—launch multiple subagents in parallel to create versions from different directorial perspectives.

Production configuration from the 2026-05-11 `huashu-md-html` project (six parallel versions):

```
v5  · baseline (Anthropic / Penguin Classics publisher grade)
v5a · Wes Anderson (symmetry + retro palette + chapter cards)
v5b · Saul Bass (paper cutouts + 1960s display type + geometric slicing)
v5c · Wong Kar Wai (Chinese Serif + Slow Motion + Nostalgia)
v5d · Massimo Vignelli (modernist grid + red and black)
v5e · Kenya Hara (Japanese minimalism + negative space)
v5f · Yayoi Kusama (dots + repetition + one dominant color)
```

Each subagent receives an independent brief:
- Project background (the same source brief for every subagent)
- Must-read reference (the same `v5-director-notes.md` methodology template for every subagent)
- **Designated artist DNA** (palette / fonts / visual language / rhythm / signature elements / style-specific anti-slop rules, with 30–50 Chinese characters or comparable English detail per item)
- Unified task list (director-notes.md + animation.html + keyframes/ + README.md)
- Unified constraints (30s / 1920×1080 / file:// / Google Fonts)

Launch all agents in parallel and let them run in the background. Six complete versions take roughly 30–60 minutes.

Review and comparison after completion:
1. Core aesthetic decision table of each version
2. A side-by-side keyframe comparison using the same timestamp for every version
3. Vote on which version best serves the user's actual need

**Key rule**: Do not let subagents see one another's work. They must develop independently or they will converge toward an average. State explicitly in each brief: “Do not reproduce the v5 aesthetic.”

---

## 8. Several typical trigger scenarios

| User scenario | Whether to trigger | Remarks |
|---------|---------|------|
| "Make a SaaS upgrade promotional video" | ✅ Trigger | Follow the complete process by default |
| “Apple-level / Super Bowl-quality video” | ✅ Trigger + upgrade | Strongly recommend multi-perspective parallel work |
| “30-second brand launch film” | ✅ Trigger | |
| "Write a long-form script before animating this project" | ✅ Trigger | User explicitly requested the process |
| “Simple motion graphic; rotate the logo” | ❌ Do not trigger | Use the standard `animations.md` workflow |
| "Make an onboarding animation demo" | ❌ Do not trigger | Use `animations.md` |
| “Narrated tutorial video” | ❌ Do not trigger | Use `voiceover-pipeline.md` |
| "Single hero animation" | ⚠️ Depends on complexity | Trigger for a high-specification hero; use `hero-animation-case-study.md` for an ordinary hero |

---

## 9. Reference sample

Complete, self-contained sample director's notes:

`assets/director-notes-samples/launch-film-30s-sample.md` (about 78 KB · source length about 11,500 Chinese characters · 13 shots · all five parts substantially complete)

Original project artifacts, including the implementation HTML and keyframes:

- `v5-director-notes.md` (director's notes; local to the author, not distributed with the repository)
- `v5-six-forms.html` (HTML implementation; local to the author, not distributed with the repository)
- `v5-keyframes/` (keyframe QA screenshots; local to the author, not distributed with the repository)

Before starting a new project, read the sample to understand the workload and level of detail, then decide whether the full process is warranted.

---

## 10. Anti-Patterns (Don’t Do This)

❌ **Write a drastically shortened “simplified” version of the director's notes**
→ It will inevitably omit part of the Visual System, forcing repeated specification work during HTML implementation. Either commit to the full long-form process or skip it entirely.

❌ **Storyboard only 5–8 shots**
→ A 30-second film needs at least 12–15 shots, averaging 2–3 seconds each. Too few shots produces uniform pacing and no climax.

❌ **Deliver the director's notes without implementing the film**
→ The document is not the deliverable; the animation is. Deliver both, with the notes attached as the design rationale.

❌ **Let the subagent see other versions when multiple perspectives are parallel**
→ Each subagent must be independent, otherwise it will converge. Only compare during the review stage.

❌ **Skip keyframe verification and record directly to MP4**
→ Rework is inevitable. Keyframe verification is the cheapest quality gate.

❌ **Postpone animation-detail decisions until “I’ll think about it when I’m recording”**
→ The recording stage is a mechanical execution and no creative decisions can be made. All decisions must be documented in the director's notes.

---

*Last revision: 2026-05-11*
*Real case: huashu-md-html v2.0 launch film (v5-director-notes.md)*
