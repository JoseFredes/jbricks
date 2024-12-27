import React, { JSX } from "react";
import { renderComponentFromJSON } from "../core";

/**
 * Adapter to render components in React.
 * @param json - Definición JSON del componente.
 * @returns JSX.Element - Componente React.
 */
export function renderReactComponent(json: any): JSX.Element {
  const domNode = renderComponentFromJSON(json);

  // Devuelve un componente React usando `dangerouslySetInnerHTML`
  return React.createElement("div", {
    dangerouslySetInnerHTML: { __html: domNode.outerHTML },
  });
}
