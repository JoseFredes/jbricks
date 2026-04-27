import { h, defineComponent } from "vue";
import type { JSONComponent } from "../types";

function buildVNode(json: JSONComponent): ReturnType<typeof h> {
  const { type, props = {}, children = [] } = json;
  const vChildren = children.map((child) =>
    typeof child === "string" ? child : buildVNode(child)
  );
  return h(type as string, props as Record<string, unknown>, vChildren);
}

/**
 * Adapter to render components in Vue 3.
 * @param json - JSON definition of the component.
 * @returns Vue component.
 */
export function renderVueComponent(json: JSONComponent) {
  return defineComponent({
    name: "JBricksComponent",
    setup() {
      return () => buildVNode(json);
    },
  });
}
