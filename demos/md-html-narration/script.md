---
title: Markdown or HTML? That Is the Wrong Question
gap: 0.5
---

## opening
A few days ago, [[cue:thariq]]Thariq from the Claude Code team published a viral post.
Its title made one simple claim: HTML is the new Markdown.
He said he barely writes Markdown files anymore; he asks AI to generate HTML instead.
Five million views later, X erupted into an argument.
One camp backed Markdown, [[cue:two-camps]]calling it the source code of the AI era.
The other said Thariq was right: HTML is the final form.

## md-side
The case for Markdown is genuinely strong.
Take OpenAI's AGENTS.md initiative from last year: [[cue:agents-md]]more than 60,000 projects use it, and AWS, Anthropic, Google, Microsoft, and OpenAI donated it to the Linux Foundation as an open standard.
Karpathy's llm-wiki is essentially three layers of Markdown; one CLAUDE.md file alone has fifty thousand stars.
Cloudflare measured the difference directly: [[cue:token-saving]]the same blog post took sixteen thousand tokens as HTML and only three thousand as Markdown.
That is an eighty-percent saving.
GitHub made the principle explicit: documentation no longer merely describes code; [[cue:doc-is-code]]documentation is code.

## html-side
But the HTML camp is not wrong either.
I agree with several arguments in Thariq's post.
First: spatial information. [[cue:spatial]]Diffs, call graphs, and architecture diagrams are spatial by nature. Markdown flattens them into a line; HTML can place them side by side. The difference in comprehension is enormous.
Second: dynamic experience. [[cue:dynamic]]When prototyping a product, no amount of prose can convey the color of a pressed button or the feel of an easing curve. HTML lets you experience it directly.
Third: structured reading. [[cue:structured]]Collapsible sections, tabbed code samples, and a sidebar glossary create a fundamentally different experience from the same words stacked in a linear document.
With Anthropic's Live Artifacts, HTML has already evolved from a static deliverable into an interactive dashboard that can pull live data.

## the-real-question
After reading it all, I wanted to say: [[cue:reveal]]both camps are arguing over the wrong question.
Both sides have won.
They have simply won different contests.
The Markdown camp answers, [[cue:question-md]]what should we write in?
The HTML camp answers, [[cue:question-html]]what should we show people?
Those are two different questions.
Why should one replace the other?

## the-split
Here is the real question.
Markdown and HTML are not substitutes; [[cue:split]]they divide the work.
In the past, you wrote Markdown and read that same Markdown.
That demanded a compromise, and Markdown won.
But AI introduced something genuinely new: [[cue:ai-changes]]it can absorb the cost of production.
The expensive part of building HTML can now be carried by AI.
You only have to consume the result.
What once required a compromise can now split into two optimized extremes.
The production side must be light, fast, and token-efficient: [[cue:md-side-win]]that is Markdown.
The consumption side must be rich, visual, and easy to share: [[cue:html-side-win]]that is HTML.
Each medium now wins at its own end.
Nobody needs the compromised middle anymore.

## activity-proof
Thariq himself is the cleanest living example.
In March, he published a guide to Skills [[cue:thariq-march]]that kept Markdown at the core.
In May, he published "HTML Is the New Markdown."
The same person, [[cue:same-person]]using each medium at the end where it excels, with no contradiction.
Karpathy and Lex Fridman offer the same pattern.
The core is a Markdown wiki; [[cue:karpathy-lex]]the shell is dynamic HTML.
Lex did not replace Karpathy's work. He added a consumption layer on top of it.

## closing
So the next time this argument starts, [[cue:final]]ask yourself one question first.
Are you dealing with writing, or with viewing?
For writing, [[cue:md-final]]use Markdown.
For viewing, [[cue:html-final]]use HTML.
Let the tools handle the conversion.
You can let go of the tribal allegiance.
