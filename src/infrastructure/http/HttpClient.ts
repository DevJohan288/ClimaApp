import { HttpError } from "./HttpError";

export class HttpClient {
  async getJson<T>(url: URL, signal?: AbortSignal): Promise<T> {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new HttpError(response.status);
    return (await response.json()) as T;
  }
}
