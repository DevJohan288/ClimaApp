import { queryRequired } from "../dom/dom";

// Base de los componentes: guarda su elemento raíz y busca hijos dentro de él.
export abstract class Component<T extends HTMLElement = HTMLElement> {
  constructor(protected readonly root: T) {}

  protected find<E extends HTMLElement>(selector: string): E {
    return queryRequired<E>(selector, this.root);
  }
}
