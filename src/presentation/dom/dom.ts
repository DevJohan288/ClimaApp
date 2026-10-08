export function queryRequired<T extends HTMLElement>(
  selector: string,
  parent: ParentNode = document,
): T {
  const node = parent.querySelector<T>(selector);
  if (!node) throw new Error(`No se encontró el elemento ${selector}`);
  return node;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
