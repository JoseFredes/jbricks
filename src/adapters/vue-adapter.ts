import { renderComponentFromJSON } from "../core";

/**
 * Adapter to render components in Vue.
 * @param json - JSON definition of the component.
 * @returns {Object} - Vue component.
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
