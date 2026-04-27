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
