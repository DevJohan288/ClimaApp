export interface CityStorage {
  load(): string | null;
  save(city: string): void;
}
