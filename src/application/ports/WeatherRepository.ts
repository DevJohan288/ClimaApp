import type { WeatherReport } from "@/domain/entities/WeatherReport";

export interface WeatherRepository {
  findByCity(city: string, signal?: AbortSignal): Promise<WeatherReport>;
}
