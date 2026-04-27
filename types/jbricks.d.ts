import { JSX } from "react";

declare module "jbricks" {
  export type HTMLTag = keyof HTMLElementTagNameMap | (string & {});

  export interface Props {
    className?: string;
    style?: Record<string, string | number>;
    [key: string]: unknown;
  }

  export interface JSONComponent {
    type: HTMLTag;
    props?: Props;
    children?: (JSONComponent | string)[];
  }

  /**
   * Renders a component from a JSON definition to an HTMLElement.
   */
  export function renderComponentFromJSON(json: JSONComponent): HTMLElement;

  /**
   * Renders a React component from a JSON definition.
   */
  export function renderReactComponent(json: JSONComponent): JSX.Element;

  /**
   * Renders a Vue 3 component from a JSON definition.
   */
  export function renderVueComponent(json: JSONComponent): object;

  /**
   * Renders a vanilla DOM component from a JSON definition.
   */
  export function renderDOMComponent(json: JSONComponent): HTMLElement;
}
