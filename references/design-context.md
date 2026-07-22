# Design Context: Start from What Already Exists

**This is the single most important principle in this skill.**

Good high-fidelity design always grows from existing design context. **Creating high-fidelity work from nothing is a last resort and inevitably produces generic results.** Begin every design task by asking: what can we use as a reference?

## What Counts as Design Context?

In descending order of priority:

### 1. The User's Design System or UI Kit
The component library, color tokens, typography rules, and icon system already used by the user's product. **This is the ideal case.**

### 2. The User's Codebase
When the user provides a repository, it contains living implementations of the components. Read files such as:
- `theme.ts` / `colors.ts` / `tokens.css` / `_variables.scss`
- Concrete components such as `Button.tsx` and `Card.tsx`
- Layout scaffolding such as `App.tsx` and `MainLayout.tsx`
- Global stylesheets

**Read the code and copy exact values**: hex codes, spacing scale, font stack, and border radius. Do not redraw them from memory.

### 3. The User's Released Product
If the user has a live product but has not provided code, inspect it with Playwright or ask for screenshots.

```bash
# Capture a public URL with Playwright
npx playwright screenshot https://example.com screenshot.png --viewport-size=1920,1080
```

This reveals the product's actual visual vocabulary.

### 4. Brand Guidelines, Logo, and Existing Assets
The user may have logo files, brand-color standards, marketing collateral, or a slide template. All of these are context.

### 5. Competitor References
If the user says, “Make it like this website,” ask for the URL or screenshots. **Do not** rely on a vague memory from training data.

### 6. An Established Design System (Fallback)
If none of the above exists, use a recognized design system as the base:
- Apple Human Interface Guidelines
- Material Design 3
- Radix Colors for color
- shadcn/ui for components
- Tailwind's default palette

Tell the user exactly what you are using, so they understand that it is a starting point rather than a final design.

## How to Gather Context

### Step 1: Ask the User

Mandatory opening questions, from `workflow.md`:

```markdown
1. Do you have an existing design system, UI kit, or component library? Where is it?
2. Do you have brand guidelines or color and typography standards?
3. Can you share screenshots or a URL for the existing product?
4. Is there a codebase I can read?
```

### Step 2: If the User Says “No,” Help Them Look

Do not immediately give up. Try:

```markdown
Let me look for clues:
- Do any of your previous projects contain related design work?
- What colors and typefaces does the company's marketing site use?
- What style is the product logo? Can you share it?
- Are there products whose design you admire and want to use as references?
```

### Step 3: Read Every Piece of Context You Can Find

If the user provides a codebase path:
1. **List the file structure first** and locate style, theme, and component files.
2. **Read theme and token files** and lift the precise hex and pixel values.
3. **Read two or three representative components** to understand the visual vocabulary: hover states, shadows, borders, and padding patterns.
4. **Read the global stylesheet** for resets and font loading.
5. **If Figma links or screenshots exist**, inspect them, but **trust the code more**.

**Important:** do not glance at the material and then work from an impression. You have not truly captured the system until you have extracted more than thirty concrete values.

### Step 4: State the System You Intend to Use

After inspecting the context, tell the user which system you have extracted:

```markdown
Based on your codebase and product screenshots, I extracted the following design system:

**Color**
- Primary: #C27558 (from tokens.css)
- Background: #FDF9F0
- Text: #1A1A1A
- Muted: #6B6B6B

**Typography**
- Display: Instrument Serif (from the @font-face in global.css)
- Body: Geist Sans
- Mono: JetBrains Mono

**Spacing** (from your scale)
- 4, 8, 12, 16, 24, 32, 48, 64

**Shadow pattern**
- `0 1px 2px rgba(0,0,0,0.04)` (subtle card)
- `0 10px 40px rgba(0,0,0,0.1)` (elevated modal)

**Border radius**
- Small controls: 4px; cards: 12px; buttons: 8px

**Component vocabulary**
- Button: filled primary, outlined secondary, ghost tertiary; all with an 8px radius
- Card: white background, subtle shadow, no border

I’ll begin with this system. Does that look right?
```

Begin production only after the user confirms.

## Designing from Nothing (Fallback When No Context Exists)

**Strong warning:** output quality falls substantially under these conditions. Tell the user clearly.

```markdown
You do not have any design context, so I can work only from general design judgment.
The result will be something that “looks fine but lacks a distinctive identity.”
Would you like to continue, or gather a few references first?
```

If the user insists, make decisions in this order:

### 1. Choose One Aesthetic Direction
Do not return a generic result. Select a clear direction:
- Brutally minimal
- Editorial / magazine
- Brutalist / raw
- Organic / natural
- Luxury / refined
- Playful / toy-like
- Retro-futuristic
- Soft / pastel

Tell the user which direction you selected.

### 2. Choose a Recognized Design System as the Skeleton
- Use Radix Colors for the palette: https://www.radix-ui.com/colors
- Use shadcn/ui for the component vocabulary: https://ui.shadcn.com
- Use Tailwind's spacing scale: multiples of four

### 3. Choose a Distinctive Type Pairing

Do not use Inter or Roboto. Suggested combinations, primarily from Google Fonts:
- Instrument Serif + Geist Sans
- Cormorant Garamond + Inter Tight
- Bricolage Grotesque + Söhne (paid)
- Fraunces + Work Sans (note that AI has already overused Fraunces)
- JetBrains Mono + Geist Sans for a technical feel

### 4. Give Every Important Decision a Rationale

Do not choose silently. Record the reasoning in an HTML comment:

```html
<!--
Design decisions:
- Primary color: warm terracotta (oklch 0.65 0.18 25) — fits the “editorial” direction
- Display: Instrument Serif for a humanist, literary feel
- Body: Geist Sans for clean contrast
- No gradients — committed to minimalism and avoiding AI slop
- Spacing: 8px base, with golden-ratio-friendly values (8/13/21/34)
-->
```

## Import Strategy When the User Provides a Codebase

If the user asks you to “import this codebase as a reference”:

### Small (<50 Files)
Read everything and internalize the context.

### Medium (50–500 Files)
Focus on:
- `src/components/` or `components/`
- Every file related to styles, tokens, or themes
- Two or three representative full-page components such as `Home.tsx` and `Dashboard.tsx`

### Large (>500 Files)
Ask the user to define the focus:
- “I need a settings page” → read existing settings-related code.
- “I need a new feature” → read the overall shell plus the closest existing analogue.
- Do not aim for exhaustive coverage; aim for precision.

## Working with Figma and Design Files

If the user provides a Figma link:

- **Do not** assume you can directly “convert Figma to HTML”; that requires additional tooling.
- Figma links are usually not publicly accessible.
- Ask the user to export and send **screenshots**, and to provide the exact color and spacing values.

If the user provides only Figma screenshots, explain:
- You can see the visual design, but cannot retrieve exact values from it.
- Ask for important numbers such as hex and pixel values, or request a code export if supported by their Figma setup.

## Final Reminder

**The quality of the context sets the upper bound for the project's design quality.**

Ten minutes spent gathering context is worth more than an hour spent inventing high-fidelity design from scratch.

**When context is missing, ask the user for it before forcing ahead.**
