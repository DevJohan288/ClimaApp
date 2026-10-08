import type { CityStorage } from "@/application/ports/CityStorage";

export class LocalStorageCityStorage implements CityStorage {
  constructor(private readonly key: string) {}

  load(): string | null {
    try {
      return localStorage.getItem(this.key);
    } catch {
      return null;
    }
  }

  save(city: string): void {
    try {
      localStorage.setItem(this.key, city);
    } catch {
      // Modo privado o almacenamiento lleno: la app funciona igual sin recordar la ciudad
    }
  }
}
