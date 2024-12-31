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
   * @param json - Definición JSON del componente.
   * @returns HTMLElement - Nodo DOM generado.
   */
  export function renderComponentFromJSON(json: JSONComponent): HTMLElement;
}
