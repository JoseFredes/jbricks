# JBricks

Render dynamic UI components from a JSON structure with TypeScript support.  
Works with vanilla DOM, React, and Vue 3 — pick the adapter you need.

**Version:** 1.2.0

## Installation

```bash
npm install jbricks
```

React and Vue are optional peer dependencies — install only what you use:

```bash
# React
npm install react react-dom

# Vue 3
npm install vue
```

---

## JSON Structure

Every component is described by a `JSONComponent` object:

```ts
interface JSONComponent {
  type: string;          // any valid HTML tag
  props?: {
    className?: string;
    style?: Record<string, string | number>;
    [key: string]: unknown; // any HTML attribute or event handler
  };
  children?: (JSONComponent | string)[];
}
```

---

## Usage

### Vanilla DOM

```ts
import { renderDOMComponent } from "jbricks";

const json = {
  type: "div",
  props: { className: "card" },
  children: [
    { type: "h1", children: ["Hello, JBricks!"] },
    { type: "p", props: { style: { color: "gray" } }, children: ["Dynamic content"] },
  ],
};

const el = renderDOMComponent(json);
document.body.appendChild(el);
```

### React

```tsx
import { renderReactComponent } from "jbricks";
import { createRoot } from "react-dom/client";

const json = {
  type: "section",
  props: { className: "wrapper" },
  children: [
    { type: "h2", children: ["React Component"] },
    {
      type: "button",
      props: { onClick: () => alert("clicked!") },
      children: ["Click me"],
    },
  ],
};

createRoot(document.getElementById("root")!).render(renderReactComponent(json));
```

### Vue 3

```ts
import { createApp } from "vue";
import { renderVueComponent } from "jbricks";

const json = {
  type: "article",
  props: { class: "content" },
  children: [
    { type: "h3", children: ["Vue Component"] },
    { type: "p", children: ["Rendered from JSON"] },
  ],
};

createApp(renderVueComponent(json)).mount("#app");
```

---

## API

| Function | Description | Returns |
|---|---|---|
| `renderDOMComponent(json)` | Render to a native DOM element | `HTMLElement` |
| `renderComponentFromJSON(json)` | Core DOM renderer (same as above, lower-level) | `HTMLElement` |
| `renderReactComponent(json)` | Render to a React element | `JSX.Element` |
| `renderVueComponent(json)` | Render to a Vue 3 component | Vue component |

---

## TypeScript

All types are exported:

```ts
import type { JSONComponent, Props } from "jbricks";
```

---

## License

MIT — José Fredes
