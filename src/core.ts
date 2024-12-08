export interface JSONComponent {
  type: string;
  props?: Record<string, any>;
  children?: JSONComponent[];
}

type ComponentRenderer = (props: Record<string, any>) => HTMLElement;

const registeredComponents: Record<string, ComponentRenderer> = {};

/**
 * Registra un componente personalizado.
 * @param type - Nombre del componente.
 * @param renderer - Función que genera el DOM del componente.
 */
export function registerComponent(
  type: string,
  renderer: ComponentRenderer
): void {
  registeredComponents[type] = renderer;
}

/**
 * Renderiza un componente desde un JSON.
 * @param json - La definición del componente en JSON.
 * @param container - El contenedor donde se renderizará.
 */
export function renderComponent(
  json: JSONComponent,
  container: HTMLElement
): void {
  const { type, props, children } = json;

  if (registeredComponents[type]) {
    const customElement = registeredComponents[type](props || {});
    container.appendChild(customElement);

    if (children) {
      children.forEach((child) => renderComponent(child, customElement));
    }
    return;
  }

  const element = document.createElement(type);

  Object.entries(props || {}).forEach(([key, value]) => {
    if (key.startsWith("on")) {
      element.addEventListener(
        key.slice(2).toLowerCase(),
        value as EventListener
      );
    } else {
      (element as any)[key] = value;
    }
  });

  (children || []).forEach((child) => renderComponent(child, element));

  container.appendChild(element);
}
