import React, { JSX } from "react";
import type { JSONComponent } from "../types";

function buildReactElement(json: JSONComponent, key?: number): JSX.Element {
  const { type, props = {}, children = [] } = json;

  const reactProps: Record<string, unknown> = { ...props };
  if (key !== undefined) reactProps.key = key;

  const reactChildren = children.map((child, i) =>
    typeof child === "string" ? child : buildReactElement(child, i)
  );

  return React.createElement(type as string, reactProps as any, ...reactChildren);
}

/**
 * Adapter to render components in React.
 * @param json - JSON definition of the component.
 * @returns JSX.Element - React component.
 */
export function renderReactComponent(json: JSONComponent): JSX.Element {
  return buildReactElement(json);
}
