# React + Babel Project Standards

Follow these technical standards when building prototypes with HTML + React + Babel. Violating them will cause runtime failures.

## Pinned Script Tags (must use these versions)

Place these three script tags in the HTML `<head>`, using the **exact pinned versions and integrity hashes**:

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
```

**Do not** use unpinned versions such as `react@18` or `react@latest`; version drift and caching problems will follow.

**Do not** omit `integrity`; it is the last line of defense if the CDN is compromised or its files are altered.

## File structure

```
project-name/
├── index.html               # Main HTML
├── components.jsx           # Components (loaded with type="text/babel")
├── data.js                  # data file
└── styles.css               # Additional CSS (optional)
```

Load files in this order:

```html
<!-- React and Babel first -->
<script src="https://unpkg.com/react@18.3.1/..."></script>
<script src="https://unpkg.com/react-dom@18.3.1/..."></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/..."></script>

<!-- then your component file -->
<script type="text/babel" src="components.jsx"></script>
<script type="text/babel" src="pages.jsx"></script>

<!-- Finally, the main entry point -->
<script type="text/babel">
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
</script>
```

**Do not** use `type="module"`; it conflicts with this Babel setup.

## Three non-negotiable rules

### Rule 1: The styles object must be uniquely named

**Incorrect** (fails when multiple component files are loaded):
```jsx
// components.jsx
const styles = { button: {...}, card: {...} };

// pages.jsx  ← The duplicate name overwrites the first object.
const styles = { container: {...}, header: {...} };
```

**Correct**: Use a unique prefix for styles in each component file.

```jsx
// terminal.jsx
const terminalStyles = { 
  screen: {...}, 
  line: {...} 
};

// sidebar.jsx
const sidebarStyles = { 
  container: {...}, 
  item: {...} 
};
```

**Or use inline styles** (widget recommendation):
```jsx
<div style={{ padding: 16, background: '#111' }}>...</div>
```

This is **non-negotiable**. Whenever you write `const styles = {...}`, replace `styles` with a specific name. Otherwise, loading multiple component files can break the entire prototype.

### Rule 2: Scopes are isolated; export shared values explicitly

**Key fact**: Babel compiles each `<script type="text/babel">` independently, so **their scopes are isolated**. A `Terminal` component defined in `components.jsx` is not automatically visible in `pages.jsx`.

**Solution**: At the end of each component file, export the components/tools to be shared to `window`:

```jsx
// components.jsx at the end
function Terminal(props) { ... }
function Line(props) { ... }
const colors = { green: '#...', red: '#...' };

Object.assign(window, {
  Terminal, Line, colors,
  // List every value that other files need here.
});
```

Then `pages.jsx` can use `<Terminal />` directly because the name resolves through `window.Terminal`.

### Rule 3: Do not use scrollIntoView

`scrollIntoView` can shift the entire HTML container upward and break the preview harness layout. **Never use it.**

Alternative:
```js
// Scroll to a position within the container.
container.scrollTop = targetElement.offsetTop;

// Or call scrollTo on the container element.
container.scrollTo({
  top: targetElement.offsetTop - 100,
  behavior: 'smooth'
});
```

## Calling the Claude API from HTML

Some native design-agent environments, such as Claude.ai Artifacts, provide `window.claude.complete` without configuration. Most local agent environments—including Claude Code, Codex, Cursor, and Trae—do not.

If the HTML prototype needs an LLM for a demonstration, such as a chat interface, use one of these options:

### Option A: Use a mock instead of a live call

Recommended for demos. Define a helper that returns a fixed response:
```jsx
window.claude = {
  async complete(prompt) {
    await new Promise(r => setTimeout(r, 800)); // simulates delay
    return "This is a mock response. Replace it with the real API in production.";
  }
};
```

### Option B: Call the Anthropic API

This requires an API key. The user must enter their own key at runtime. **Never hardcode API keys in HTML.**

```html
<input id="api-key" placeholder="Paste your Anthropic API key" />
<script>
window.claude = {
  async complete(prompt) {
    const key = document.getElementById('api-key').value;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    return data.content[0].text;
  }
};
</script>
```

**Note**: Calling the Anthropic API directly from a browser may fail because of CORS. If the user's preview environment does not provide a CORS proxy, use the mock from Option A or explain that a backend proxy is required.

### Option C: Use the LLM capability on the agent side to generate mock data

For a local-only demo, use the agent's LLM capability—or a multi-model skill installed by the user—to generate representative mock data in advance, then embed it in the HTML. The runtime will have no API dependency.

## Typical HTML starting template

Copy this template as the skeleton of the React prototype:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Prototype Name</title>

  <!-- React + Babel pinned -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; width: 100%; }
    body { 
      font-family: -apple-system, 'SF Pro Text', sans-serif;
      background: #FAFAFA;
      color: #1A1A1A;
    }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- Your component file -->
  <script type="text/babel" src="components.jsx"></script>

  <!-- Main entrance -->
  <script type="text/babel">
    const { useState, useEffect } = React;

    function App() {
      return (
        <div style={{padding: 40}}>
          <h1>Hello</h1>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
```

## Common errors and solutions

**`styles is not defined` or `Cannot read property 'button' of undefined`**
→ You defined `const styles` in one file and it was overwritten by another file. Give each one a specific name.

**`Terminal is not defined`**
→ The scope is blocked when referencing across files. Add `Object.assign(window, {Terminal})` at the end of the file defining Terminal.

**The entire page is blank, but the console shows no errors**
→ A JSX syntax error is likely being obscured by the minified Babel build. Temporarily replace `babel.min.js` with the unminified `babel.js` to get a clearer error.

**ReactDOM.createRoot is not a function**
→ The wrong version is loaded. Confirm that `react-dom@18.3.1` is in use—not 17 or another release.

**`Objects are not valid as a React child`**
→ You rendered an object rather than JSX or a string. Usually `{someObj}` should be `{someObj.name}`.

## How to split files in a large project

A 1,000-line file is difficult to maintain. Use this structure:

```
Project/
├── index.html
├── src/
│   ├── primitives.jsx      # Primitives: Button, Card, Badge...
│   ├── components.jsx      # Domain components: UserCard, PostList...
│   ├── pages/
│   │   ├── home.jsx        # Home page
│   │   ├── detail.jsx      # Details page
│   │   └── settings.jsx    # Setting page
│   ├── router.jsx          # Simple routing through React state
│   └── app.jsx             # Entry component
└── data.js                 # mock data
```

Load in order in HTML:
```html
<script type="text/babel" src="src/primitives.jsx"></script>
<script type="text/babel" src="src/components.jsx"></script>
<script type="text/babel" src="src/pages/home.jsx"></script>
<script type="text/babel" src="src/pages/detail.jsx"></script>
<script type="text/babel" src="src/pages/settings.jsx"></script>
<script type="text/babel" src="src/router.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
```

At the end of **every file**, export shared values with `Object.assign(window, {...})`.
