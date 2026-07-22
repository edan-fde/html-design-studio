# In-Depth Design Critique Guide

> Detailed reference for Phase 7. Includes scoring criteria, priorities by output type, and a list of common problems.

---

## Detailed Scoring Criteria

### 0. Concept / Point of View · Highest Weight

First ask, “Does this design have an idea?” Only then judge how well that idea is executed. This category is numbered zero because execution is an amplifier: amplifying an empty concept only makes the emptiness more obvious.

| Score | Standard |
|------|------|
| 9–10 | A distinctive idea grows directly from the user's content; its visual motif cannot be replaced without changing the meaning. |
| 7–8 | A clear point of view exists; the motif relates to the content, although a similar theme could just about substitute for it. |
| 5–6 | Style without concept: visually attractive, but it says nothing. |
| 3–4 | A generic template with a new skin; no concept at all. |
| 1–2 | Even the style is wrong; the work is merely an accumulation of decoration. |

**Core questions:**
- What does this design say? Can its idea be stated in one sentence? If not, it does not have one.
- If every word and logo is covered, is the subject still recognizable? If not, the visual language is not carrying meaning. (Exception: typography in which text itself is the motif. In that case ask whether the same typographic treatment would still work for a different subject.)
- Would the design still work after replacing the client or product name? **If yes, it is a template, and this category scores no more than 5.**
- Does the form contain a distinctive visual motif derived from the content? This echoes the form-derivation rule in `SKILL.md`: form should emerge from content, not be selected from a style library.

**Automatic ceiling:** if Concept scores 5 or below, the overall score is capped at 6.0, the lower bound of “Good.” The other five categories measure execution, and immaculate execution cannot rescue a design without an idea—it only polishes the template to a brighter shine.

### 1. Philosophy Alignment

| Score | Standard |
|------|------|
| 9–10 | The design perfectly embodies the chosen philosophy; every detail has a philosophical rationale. |
| 7–8 | The overall direction is correct and the defining characteristics are present, with only isolated deviations. |
| 5–6 | The intention is visible, but elements from other styles have crept into the execution and weakened its purity. |
| 3–4 | Superficial imitation without understanding the philosophy's core. |
| 1–2 | Almost unrelated to the chosen philosophy. |

**Review questions:**
- Does it use the signature methods of that designer or studio?
- Do the color, typography, and layout belong to that philosophical system?
- Are any elements self-contradictory—for example, selecting Kenya Hara and then filling every available space?

### 2. Visual Hierarchy

| Score | Standard |
|------|------|
| 9–10 | The viewer's eye follows the designer's intended path naturally; information is acquired without friction. |
| 7–8 | Primary and secondary elements are clear, with only one or two ambiguous levels. |
| 5–6 | Headings can be distinguished from body text, but the intermediate hierarchy is confused. |
| 3–4 | Information is laid out flat, with no clear visual entry point. |
| 1–2 | Chaotic; the viewer does not know where to look first. |

**Review questions:**
- Is the scale contrast between heading and body text sufficient—at least 2.5×?
- Do color, weight, and size establish three or four clear levels?
- Does negative space guide the eye?
- The “squint test”: when you squint, does the hierarchy remain clear?

### 3. Craft Quality

| Score | Standard |
|------|------|
| 9–10 | Pixel-perfect; alignment, spacing, and color contain no defects. |
| 7–8 | Refined overall, with one or two minor alignment or spacing issues. |
| 5–6 | Basically aligned, but spacing is inconsistent and color usage lacks a system. |
| 3–4 | Obvious alignment errors, inconsistent spacing, and too many colors. |
| 1–2 | Rough; looks like a draft. |

**Review questions:**
- Is a consistent spacing system in use, such as an 8 pt grid?
- Is spacing consistent between elements of the same kind?
- Is the number of colors controlled—usually no more than three or four?
- Are type families controlled—usually no more than two?
- Are edges aligned precisely?

### 4. Functionality

| Score | Standard |
|------|------|
| 9–10 | Every design element serves the goal; nothing is redundant. |
| 7–8 | Function clearly leads, with a small amount of removable decoration. |
| 5–6 | Basically usable, but obvious decorative elements distract from the task. |
| 3–4 | Form dominates function; the user must work to find information. |
| 1–2 | Completely overwhelmed by decoration and no longer able to communicate. |

**Review questions:**
- Would removing any one element make the design worse? If not, remove it.
- Are the CTA and key information in the most prominent positions?
- Are any elements present only “because they look good”?
- Does information density suit the medium? Slides should not be dense; PDFs may be denser.

### 5. Originality

| Score | Standard |
|------|------|
| 9–10 | Genuinely fresh; finds a distinctive expression inside the chosen philosophical framework. |
| 7–8 | Contains original thinking rather than merely applying a template. |
| 5–6 | Competent but conventional; looks like a template. |
| 3–4 | Relies heavily on clichés, such as gradient spheres standing for AI. |
| 1–2 | Entirely assembled from templates or stock assets. |

**Review questions:**
- Does it avoid common clichés? See the list below.
- Does it retain an individual voice while respecting the design philosophy?
- Does it include any decision that is unexpected yet entirely appropriate?

---

## Priorities by Output Type

Different outputs require different review priorities. Concept is omitted from this table because it is the first gate for every scenario and is never traded against the others.

| Scenario | Most Important | Secondary | May Be Relaxed |
|------|-----------|--------|--------|
| WeChat article cover / inline illustration | Originality, visual hierarchy | Philosophy alignment | Functionality (a single image has no interaction) |
| Infographic | Functionality, visual hierarchy | Craft quality | Originality (accuracy comes first) |
| PowerPoint / Keynote | Visual hierarchy, functionality | Craft quality | Originality (clarity comes first) |
| PDF / white paper | Craft quality, functionality | Visual hierarchy | Originality (professionalism comes first) |
| Landing page / official website | Functionality, visual hierarchy | Originality | — (all-round quality required) |
| App UI | Functionality, craft quality | Visual hierarchy | Philosophy alignment (usability comes first) |
| Xiaohongshu graphic | Originality, visual hierarchy | Philosophy alignment | Craft quality (atmosphere comes first) |

---

## Top 10 Common Design Problems

### 1. AI-Technology Clichés
**Problem:** gradient spheres, digital rain, blue circuit boards, robot faces.
**Why it matters:** audiences are visually exhausted by them and cannot distinguish your work from anyone else's.
**Fix:** replace literal symbols with an abstract metaphor—for example, convey “conversation” without using a chat-bubble icon.

### 2. Insufficient Type-Scale Hierarchy
**Problem:** heading and body text are too close in size (<2.5×).
**Why it matters:** users cannot locate key information quickly.
**Fix:** make headings at least three times the body size—for example, 16 px body → 48–64 px heading.

### 3. Too Many Colors
**Problem:** more than five colors are used without a clear hierarchy.
**Why it matters:** visual disorder and a weak sense of brand.
**Fix:** restrict the palette to one primary + one secondary + one accent + neutrals.

### 4. Inconsistent Spacing
**Problem:** spacing is arbitrary and lacks a system.
**Why it matters:** the work looks unprofessional and its visual rhythm becomes chaotic.
**Fix:** establish an 8 pt grid and use only 8 / 16 / 24 / 32 / 48 / 64 px spacing values.

### 5. Insufficient Negative Space
**Problem:** content fills every available area.
**Why it matters:** crowding causes reading fatigue and makes communication less efficient.
**Fix:** negative space should occupy at least 40% of the area, or 60%+ in minimalist work.

### 6. Too Many Fonts
**Problem:** more than three typefaces are used.
**Why it matters:** visual noise weakens unity.
**Fix:** use no more than two typefaces—one display and one body face—and create variation with weight and size.

### 7. Inconsistent Alignment
**Problem:** some content is left-aligned, some centered, and some right-aligned.
**Why it matters:** it breaks the sense of visual order.
**Fix:** choose one alignment, usually left alignment, and apply it consistently.

### 8. Decoration Overwhelms Content
**Problem:** background patterns, gradients, or shadows steal attention from the primary content.
**Why it matters:** the priorities are reversed; users came for information, not decoration.
**Fix:** ask, “Would the design become worse if this decoration disappeared?” If not, remove it.

### 9. Cyber-Neon Overuse
**Problem:** a dark navy background (`#0D1117`) plus glowing neon colors.
**Why it matters:** it is part of this skill's default aesthetic exclusion zone and has become one of the largest clichés. Users may override this rule to match their own brand.
**Fix:** choose a more distinctive palette; consult the color systems in the twenty styles.

### 10. Information Density Does Not Fit the Medium
**Problem:** an entire page of prose on one slide, or ten elements crammed into a cover image.
**Why it matters:** every medium has a different optimal information density.
**Fix:**
- Slides: one central point per slide.
- Cover image: one visual focus.
- Infographic: reveal information in layers.
- PDF: greater density is acceptable, but navigation must remain clear.

---

## Critique Output Template

```
## Design Critique Report

**Overall score**: X.X/10 [Excellent (8+) / Good (6–7.9) / Needs improvement (4–5.9) / Fail (<4)]
(If Concept ≤5, the overall score is capped at 6. Fix the concept before discussing execution.)

**Category scores**:
- Concept / point of view: X/10 [What is this design's idea? State it in one sentence.]
- Philosophy alignment: X/10 [One-sentence explanation]
- Visual hierarchy: X/10 [One-sentence explanation]
- Craft quality: X/10 [One-sentence explanation]
- Functionality: X/10 [One-sentence explanation]
- Originality: X/10 [One-sentence explanation]

### Strengths (Keep)
- [Identify exactly what works, using design language]

### Problems (Fix)
[Order by severity]

**1. [Problem name]** — ⚠️ Critical / ⚡ Important / 💡 Polish
- Current state: [Describe what exists]
- Problem: [Explain why this is a problem]
- Fix: [Give a concrete operation, including values]

### Quick Wins
If only five minutes are available, do these three things first:
- [ ] [Highest-impact fix]
- [ ] [Second most important fix]
- [ ] [Third most important fix]
```

---

**Version:** v1.0
**Updated:** 2026-02-13
