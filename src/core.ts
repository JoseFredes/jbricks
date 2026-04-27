import type { JSONComponent } from "./types";

export type { Props, JSONComponent } from "./types";

const VALID_HTML_TAG = /^[a-zA-Z][a-zA-Z0-9-]*$/;

/**
 * Render component from JSON.
 * @param json - Component definition in JSON format.
 * @returns HTMLElement - Generated DOM node.
 */
export function renderComponentFromJSON(json: JSONComponent): HTMLElement {
  if (!json || typeof json !== "object" || !json.type) {
    throw new TypeError(`[jbricks] Expected a JSONComponent with a type property`);
  }
  if (!VALID_HTML_TAG.test(String(json.type))) {
    throw new TypeError(`[jbricks] Invalid element type: "${json.type}"`);
  }

  const { type, props = {}, children = [] } = json;
  const element = document.createElement(type);

  if (props.className) {
    element.className = props.className as string;
  }
  if (props.style) {
    Object.entries(props.style as Record<string, string | number>).forEach(([key, value]) => {
      (element.style as unknown as Record<string, unknown>)[key] = value;
    });
  }

  Object.entries(props).forEach(([key, value]) => {
    if (key === "className" || key === "style") return;
    if (key.startsWith("on") && typeof value === "function") {
      element.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (value !== null && value !== undefined) {
      element.setAttribute(key, String(value));
    }
  });

  children.forEach((child) => {
    const childNode =
      typeof child === "string"
        ? document.createTextNode(child)
        : renderComponentFromJSON(child);
    element.appendChild(childNode);
  });

  return element;
}
