declare module "jbricks" {
  export type Props = {
    [key: string]: any;
    className?: string;
    style?: Record<string, string | number>;
  };

  export type JSONComponent = {
    type: string;
    props?: Props;
    children?: JSONComponent[] | string[];
  };

  /**
   * Renders a component from JSON.
   * @param json - JSON definition of the component.
   * @returns HTMLElement - Generated DOM node.
   */
  export function renderComponentFromJSON(json: JSONComponent): HTMLElement;

  /**
   * Renders a React component from JSON.
   * @param json - JSON definition of the component.
   * @returns JSX.Element - React component.
   */
  export function renderReactComponent(json: JSONComponent): JSX.Element;
}
