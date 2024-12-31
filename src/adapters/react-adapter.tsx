import React, { JSX } from "react";
import { renderComponentFromJSON, JSONComponent } from "jbricks";

/**
 * Adapter to render components in React.
 * @param json - JSON definition of the component.
 * @returns JSX.Element - React component.
 */
export function renderReactComponent(json: JSONComponent): JSX.Element {
  const domNode = renderComponentFromJSON(json);

  // Returns a React component using `dangerouslySetInnerHTML`.
  return React.createElement("div", {
    dangerouslySetInnerHTML: { __html: domNode.outerHTML },
  });
}
