import { renderComponentFromJSON } from "../core";

/**
 * Adaptador para renderizar componentes en Vue.
 * @param json - Definición JSON del componente.
 * @returns {Object} - Componente Vue.
 */
export function renderVueComponent(json: any) {
  const domNode = renderComponentFromJSON(json);

  // Devuelve un componente Vue que usa el nodo DOM como innerHTML
  return {
    render(h: any) {
      return h("div", {
        domProps: {
          innerHTML: domNode.outerHTML,
        },
      });
    },
  };
}
