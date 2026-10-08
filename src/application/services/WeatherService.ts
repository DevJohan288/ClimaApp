import type { WeatherReport } from "@/domain/entities/WeatherReport";
import { InvalidCityError } from "@/domain/errors/InvalidCityError";
import type { WeatherRepository } from "../ports/WeatherRepository";

export class WeatherService {
  private static readonly MIN_CITY_LENGTH = 2;

  constructor(private readonly repository: WeatherRepository) {}

  async getByCity(city: string, signal?: AbortSignal): Promise<WeatherReport> {
    const name = city.trim();
    if (name.length < WeatherService.MIN_CITY_LENGTH) {
      throw new InvalidCityError();
    }
    return this.repository.findByCity(name, signal);
  }
}
