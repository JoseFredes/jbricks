type Props = {
  [key: string]: any;
  className?: string;
  style?: Record<string, string | number>;
};

type JSONComponent = {
  type: string; // Element Name (e.g., div, span, h1)
  props?: Props; // Element props
  children?: JSONComponent[] | string[]; // Elements children
};

/**
 * Render component from JSON.
 * @param json - Component definition of JSON.
 * @returns HTMLElement - DOM  node generated.
 */
export function renderComponentFromJSON(json: JSONComponent): HTMLElement {
  const { type, props = {}, children = [] } = json;

  // Create standard HTML element
  const element = document.createElement(type);

  // Assign className and style properties
  if (props.className) {
    element.className = props.className;
  }
  if (props.style) {
    Object.entries(props.style).forEach(([key, value]) => {
      (element.style as any)[key] = value;
    });
  }

  // Assign other props and event listeners
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      // Event listener props
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key !== "className" && key !== "style") {
      element.setAttribute(key, value);
    }
  });

  // Render children
  children.forEach((child) => {
    const childElement =
      typeof child === "string"
        ? document.createTextNode(child)
        : renderComponentFromJSON(child);
    element.appendChild(childElement);
  });

  return element;
}
