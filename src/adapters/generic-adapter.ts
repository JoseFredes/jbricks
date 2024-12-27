import { renderComponentFromJSON } from "../core";

/**
 * Generic adapter that returns the generated DOM node..
 * @param json - Definición JSON del componente.
 * @returns HTMLElement - Nodo DOM generado.
 */
export function renderDOMComponent(json: any): HTMLElement {
  return renderComponentFromJSON(json);
}
