import { renderComponentFromJSON } from "../core";
import type { JSONComponent } from "../types";

/**
 * Generic adapter that returns the generated DOM node.
 * @param json - JSON definition of the component.
 * @returns HTMLElement - DOM node generated.
 */
export function renderDOMComponent(json: JSONComponent): HTMLElement {
  return renderComponentFromJSON(json);
}
