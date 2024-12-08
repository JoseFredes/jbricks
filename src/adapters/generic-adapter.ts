import { renderComponentFromJSON } from "../core";

/**
 * Adaptador genérico que devuelve el nodo DOM generado.
 * @param json - Definición JSON del componente.
 * @returns HTMLElement - Nodo DOM generado.
 */
export function renderDOMComponent(json: any): HTMLElement {
  return renderComponentFromJSON(json);
}
