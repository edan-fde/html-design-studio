# Parallel Multi-Perspective Experiment · Case Study

> huashu-md-html v2.0 launch film project · 2026-05-11
> Parallel experiment across six artist perspectives: director's notes, HTML, and keyframes

---

## Background

When the user requested a 30-second upgrade film for `huashu-md-html` v2.0, the main thread first produced the v5 baseline, drawing on Anthropic and Penguin Classics. The user believed it could go further and gave a decisive instruction:

> “Ask different subagents to generate six completely different approaches to expression and visual design. Try different directors and artists, then review them together once all are complete.”

This became the first systematic experiment in parallel, multi-perspective direction and validated a reusable workflow.

---

## How the six perspectives were selected

Do not choose six designers at random. Their visual languages must differ radically enough to prevent convergence.

The six selected perspectives were:

| Perspective | Genre | Aesthetic anchor | Differences from other perspectives |
|------|------|---------|----------------|
| **v5 baseline** | Modern publishing | Anthropic terracotta + Penguin Classics serif + Vignelli grid | Safe, assured taste |
| **v5a Wes Anderson** | Cinematic chapter-card aesthetic | *The French Dispatch* editorial feel + 1960s Olivetti industrial catalogues | Symmetrical compositions + chapter cards + decorative borders |
| **v5b Saul Bass** | 1960s film-title art | Cut paper + Trajan capitals + kinetic geometry | Paper-cut silhouettes + oversized type + strong diagonals |
| **v5c Wong Kar-wai** | Hong Kong New Wave | *In the Mood for Love* and *2046*: letterboxing + Chinese serifs | Slow motion + diffused halos + Chinese-led typography |
| **v5d Massimo Vignelli** | 1970s modernism | Knoll identity manual + NYC Subway map | Strict grid + three-color rule + no decoration |
| **v5e Kenya Hara** | Japanese minimalism | MUJI posters + *White* | Philosophy of emptiness + no chrome + *ma*, or negative space |
| **v5f Yayoi Kusama** | Installation art | Infinity Mirror Rooms + Polka Dot Obsession | obsessive repetition + single strong color + polka dots |

**Selection principles**:
1. **Three geographic cultures** (Western cinema / Japanese design / Hong Kong Chinese culture)
2. **3 different eras** (1960s / 1970s / 2010s+)
3. **Three different media** (film / graphic design / installation art)
4. **Each has a visual signature far removed from generic SaaS aesthetics**

---

## Implementation process

### Step 1 · Write an independent brief for each perspective (about 15 minutes)

Each brief contains eight fixed fields:

```
1. Project background (the same source brief for every subagent)
2. Must-read reference (the same `v5-director-notes.md` methodology template for every subagent)
3. Assignment (four required deliverables)
4. Artist DNA (six core fields):
   - Color palette (specific HEX values)
   - Typefaces (specific names + alternatives)
   - Visual language (core principles)
   - Signature elements (recognizable motifs)
   - Rhythm (different from other perspectives)
   - Style-specific anti-AI-slop rules
5. 30-second structural reference (draft of 4–6 shots)
6. Destination-card requirements (real and readable)
7. Hard constraints (30s / 1920×1080 / `file://` / Google Fonts CDN)
8. Output QA checklist + completion-report format
```

**Key**: every brief must explicitly say **“Do not repeat the v5 aesthetic.”** Without that constraint, the v5 director's notes will pull the explorations toward the baseline.

### Step 2 · Start six subagents in parallel

```js
spawn_agent({ task_name: "v5a_anderson", message: "..." })
spawn_agent({ task_name: "v5b_bass", message: "..." })
// ...six total
```

Dispatch all six asynchronously using the current runtime's subagent tool and allow 30–60 minutes for completion.

### Step 3 · Productive work while waiting

Do not busy-poll agent status; use the runtime's wait/notification mechanism. While waiting:

- Fix defects in the v5 baseline
- Write review framework (dimensions/Q&A for each version)
- Distill the method into the skill (the origin of this case study)
- Prepare final summary document skeleton

### Step 4 · Failure handling (about 16% failure rate, acceptable)

Observed in practice: about one of six subagents may fail because of network errors or token limits—the first Bass attempt hit a socket error. Recovery process:

1. **Inspect the agent's output folder immediately** when its completion notification arrives.
2. If key deliverables are missing, restart it with the same brief and note that the previous run failed.
3. If the result is partial—for example, HTML exists but screenshots do not—the main thread can capture the missing Playwright images without restarting the agent.

### Step 5 · Systematic review after all six versions complete

Review framework (5 dimensions + 3 top-level questions + use case allocation):

```
Five-dimension score (1–10 each):
- Distinctiveness — visual differentiation
- Coherence — aesthetic consistency
- Anti-slop — execution of the anti-AI-slop rules
- Story arc — pacing and narrative structure
- Pause-and-look — density of rewarding details

Three top-level questions:
- Q1 · Would someone share a screenshot? (Can it make viewers pause on social platforms?)
- Q2 · Will they remember one sentence? (Does it leave a thesis-level memory?)
- Q3 · Will it age well? (Will it still avoid looking cheap five years from now?)

Use-case assignment by platform and audience:
- WeChat Official Accounts / X / Bilibili / Moments / Dribbble / client presentations / private channels / ...
```

The complete rubric lives in the original project's local `REVIEW.md`, which is not distributed with this repository; the included sample is `assets/director-notes-samples/launch-film-30s-sample.md`.

---

## Experiment output (facts)

### Documentation volume

The counts below are Chinese characters in the source documentation, not English words. An English version should preserve comparable decision density rather than copying the numbers as word counts.

- v5 baseline director's notes: about 11,500 Chinese characters
- Six perspective-specific sets of director's notes: about 4,000–12,000 Chinese characters each
- Total documentation: approximately 55,000–70,000 Chinese characters
- All five major sections substantially complete in all six versions

### HTML implementation

- Each version is a self-contained `animation.html`, 30 seconds at 1920×1080
- File size 28-74KB
- Every version opens over `file://` with no server dependency

### Key frames

- 10–18 PNGs per version, covering the complete 30-second story arc
- Total screenshots: 80+
- Average PNG size: 100–200 KB

### Duration

- Six parallel subagents: about 12–15 minutes according to `duration_ms`
- The main thread completed v5 repairs and methodology documentation in the same window
- End-to-end time from launch to all six complete deliverable sets: about 60 minutes

---

## Key insights (written to future users of huashu-design)

### Insight 1 · The “write extensive director's notes first” method is **fully reproducible**

All six subagents produced the five major sections at source lengths of 4,000–12,000 Chinese characters, then implemented marketing-ready HTML. The methodology therefore does not depend on one exceptional implementer: **given a precise brief, multiple independent executors can produce consistently strong results.**

### Insight 2 · "Perspective" must be specific to "work + year"

Specific work dialogues are listed in each brief:
- Anderson → *The French Dispatch* (2021) + *Moonrise Kingdom* (2012) + Penguin Classics dust jackets + 1960s Olivetti catalogues
- WKW → *In the Mood for Love* (2000) + *2046* (2004)
- Vignelli → 1972 NYC Subway map + Knoll identity manual + *The Vignelli Canon*
- Hara → MUJI brand work, 1995–2023 + *White* + Junya Ishigami's transparency
- Kusama → *Infinity Mirrored Rooms* (2013–2023) + *Polka Dot Obsession*

**Observed result**: every subagent captured the source works' distinctive visual DNA instead of producing an averaged genre imitation.

### Insight 3 · Style-specific anti-AI-slop rules are essential

Universal exclusions—purple gradients, emoji, SVG characters—apply to every version. But **each style also needs its own exclusions**:

- Bass: No Helvetica (too clean, Bass is rough)
- Vignelli: No rounded corners (all corners 90°)
- Hara: no gradients and no sans-serif display type
- Kusama: No modern SaaS look
- Anderson: no cyber-style palette
- WKW: No Inter (WKW uses serifs)

With these additions, all six versions maintain strong stylistic purity and remain clearly distinct from one another.

### Insight 4 · The real value of multiple perspectives is not "selecting the winner"

The original plan was to choose one A/B-test winner. The review revealed something more useful: **each of the six versions had a clear role**:
- v5 baseline → product page / WeChat article (high information density)
- Anderson → long-form WeChat header (strong magazine-page-turning feel)
- Wong Kar-wai → Bilibili / Chinese cultural audience (nostalgic warmth)
- Vignelli → design communities / Dribbble (every frame reads as a printed poster)
- Hara → client demonstration / static still (minimalist philosophy)
- Kusama → X short video / viral spread (visual impact)

**Conclusion**: Marketing is not one-size-fits-all; it is platform-specific. The value of six parallel perspectives is not to discard five versions, but to give the project six differentiated tools.

### Insight 5 · Subagent failure rate ~16% is acceptable

One of six attempts failed—the first Bass run hit a socket error. Recovery cost was a restart, five minutes to simplify the brief, and a 12–15-minute wait. Compared with having one agent produce six versions sequentially for 90+ minutes, parallel execution plus retry is clearly more efficient.

### Insight 6 · The main thread should advance substantive work while waiting

Subagents take 12–15 minutes to complete. The main thread should use that time productively:

- **Fix bugs in the main version** (especially those already reported by the user)
- **Write the review framework**
- **Distill the methodology into the skill** (as in this case study)
- **Prepare the final summary** so users can understand the results at a glance

That is the main thread's responsibility in a parallel multi-agent workflow: not passive project management, but advancing the work synchronously as an orchestrator.

---

## When to enable "Multi-perspective parallelism"

| Scenario | Whether to enable | Reason |
|------|---------|------|
| The user clearly said "want to look at different directions" and "do more versions" | ✅ Enable immediately | Direct demand |
| The user dislikes the first version but cannot articulate the desired direction | ✅ Enable | A/B comparison beats guessing |
| The project targets several platforms (X / WeChat Official Accounts / Bilibili / Moments) | ✅ Enable | Assign a version to each platform |
| The client has no clear preference but has sufficient time and token budget | ✅ Enable | Parallel options cost less than repeated undirected revisions |
| The user has given a clear style reference and needs only one version | ❌ Do not enable | Unnecessary exploration |
| The task is a simple motion graphic or icon animation | ❌ Do not enable | Over-engineered |
| Deadline under 30 minutes | ❌ Do not enable | Subagents cannot finish in time |

---

## Complete methodology flow chart

```
User brief (including quality expectations)
       ↓
[Main thread] Write the extensive v5 baseline director's notes (five major parts)
       ↓
[Main thread] Implement the v5 HTML and capture keyframes (marketing baseline)
       ↓
[Decision point] Is multi-view enabled?
       ↓ YES
[Main thread] Select six distinct perspectives and write six independent briefs (eight fields each)
       ↓
[6 subagents parallel]
   ├── v5a brief → director-notes + html + keyframes + README
   ├── v5b brief → ...
   ├── v5c brief → ...
   ├── v5d brief → ...
   ├── v5e brief → ...
   └── v5f brief → ...
       ↓
[Main thread in parallel] Repair v5 · Write review framework · Distill methodology
       ↓
[All six completion notifications arrive]
       ↓
[Main thread] Detect failures · Retry or capture missing screenshots
       ↓
[Main thread] Score five dimensions · Answer three top-level questions · Assign use cases
       ↓
[Main thread] Write final REVIEW.md
       ↓
[Delivery] Six complete versions + review + platform recommendations
```

---

## Related documents

- Complete methodology: `references/launch-film-director-notes.md`
- Single-view sample: `assets/director-notes-samples/launch-film-30s-sample.md` (v5 baseline)
- Original project: the author's local demos directory (contains all six explorations plus the baseline; not included in this repository)
- Full review: the author's local `REVIEW.md` (not included in this repository)

---

*Last updated: 2026-05-11*
*Case study: huashu-md-html v2.0 launch film, six-perspective parallel experiment*
