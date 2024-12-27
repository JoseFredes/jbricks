import { renderComponentFromJSON } from "../core";

/**
 * Adapter to render components in Vue.
 * @param json - JSON definition of the component.
 * @returns {Object} - Vue component.
 */
export function renderVueComponent(json: any) {
  const domNode = renderComponentFromJSON(json);

  // Returns a Vue component that uses the DOM node as innerHTML
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
