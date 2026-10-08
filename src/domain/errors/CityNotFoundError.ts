import { DomainError } from "./DomainError";

export class CityNotFoundError extends DomainError {
  constructor(readonly city: string) {
    super(`No encontré resultados para "${city}". Revisa el nombre e inténtalo de nuevo.`);
  }
}
