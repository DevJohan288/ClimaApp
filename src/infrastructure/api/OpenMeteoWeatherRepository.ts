import type { WeatherRepository } from "@/application/ports/WeatherRepository";
import { CurrentWeather } from "@/domain/entities/CurrentWeather";
import { DayForecast } from "@/domain/entities/DayForecast";
import { Place } from "@/domain/entities/Place";
import { WeatherReport } from "@/domain/entities/WeatherReport";
import { CityNotFoundError } from "@/domain/errors/CityNotFoundError";
import { WeatherCondition } from "@/domain/value-objects/WeatherCondition";
import type { OpenMeteoConfig } from "../config/apiConfig";
import type { HttpClient } from "../http/HttpClient";
import type { ForecastResponse, GeocodingResponse } from "./openMeteo.dto";

export class OpenMeteoWeatherRepository implements WeatherRepository {
  constructor(
    private readonly http: HttpClient,
    private readonly config: OpenMeteoConfig,
  ) {}

  async findByCity(city: string, signal?: AbortSignal): Promise<WeatherReport> {
    const place = await this.findPlace(city, signal);
    return this.loadForecast(place, signal);
  }

  private async findPlace(city: string, signal?: AbortSignal): Promise<Place> {
    const url = new URL(this.config.geocodingUrl);
    url.search = new URLSearchParams({
      name: city,
      count: "1",
      language: "es",
      format: "json",
    }).toString();

    const data = await this.http.getJson<GeocodingResponse>(url, signal);
    const match = data.results?.[0];
    if (!match) throw new CityNotFoundError(city);

    return new Place(match.name, match.latitude, match.longitude, match.admin1, match.country);
  }

  private async loadForecast(place: Place, signal?: AbortSignal): Promise<WeatherReport> {
    const url = new URL(this.config.forecastUrl);
    url.search = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude),
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min",
      timezone: "auto",
      forecast_days: String(this.config.forecastDays),
    }).toString();

    const { current, daily } = await this.http.getJson<ForecastResponse>(url, signal);

    return new WeatherReport(place, this.toCurrent(current), this.toDays(daily));
  }

  private toCurrent(dto: ForecastResponse["current"]): CurrentWeather {
    return new CurrentWeather(
      dto.temperature_2m,
      dto.apparent_temperature,
      dto.relative_humidity_2m,
      dto.wind_speed_10m,
      new WeatherCondition(dto.weather_code),
    );
  }

  private toDays(dto: ForecastResponse["daily"]): DayForecast[] {
    return dto.time.map(
      (date, i) =>
        new DayForecast(
          date,
          dto.temperature_2m_max[i],
          dto.temperature_2m_min[i],
          new WeatherCondition(dto.weather_code[i]),
        ),
    );
  }
}
