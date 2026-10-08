import { DomainError } from "./DomainError";

export class InvalidCityError extends DomainError {
  constructor() {
    super("Escribe el nombre de una ciudad (mínimo 2 letras).");
  }
}
