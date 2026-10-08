// Base para los errores que el usuario puede entender y que se muestran tal cual.
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
