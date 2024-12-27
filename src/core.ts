type Props = {
  [key: string]: any;
  className?: string;
  style?: Record<string, string | number>;
};

type JSONComponent = {
  type: string; // Element Name (e.g., div, span, h1)
  props?: Props; // Propiedades del elemento
  children?: JSONComponent[] | string[]; // Elements children
};

/**
 * Renderiza un componente desde JSON.
 * @param json - Definición del componente en JSON.
 * @returns HTMLElement - Nodo DOM generado.
 */
export function renderComponentFromJSON(json: JSONComponent): HTMLElement {
  const { type, props = {}, children = [] } = json;

  // Crear un elemento HTML estándar
  const element = document.createElement(type);

  // Asignar propiedades como `className` y `style`
  if (props.className) {
    element.className = props.className;
  }
  if (props.style) {
    Object.entries(props.style).forEach(([key, value]) => {
      (element.style as any)[key] = value;
    });
  }

  // Asignar otros atributos o eventos
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      // Manejo de eventos como onClick
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key !== "className" && key !== "style") {
      element.setAttribute(key, value);
    }
  });

  // Renderizar hijos
  children.forEach((child) => {
    const childElement =
      typeof child === "string"
        ? document.createTextNode(child)
        : renderComponentFromJSON(child);
    element.appendChild(childElement);
  });

  return element;
}
