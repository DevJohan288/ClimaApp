export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`El servicio respondió con el estado ${status}`);
    this.name = "HttpError";
  }
}
