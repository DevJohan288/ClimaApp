import type { WeatherCondition } from "../value-objects/WeatherCondition";

export class CurrentWeather {
  constructor(
    readonly temperature: number,
    readonly feelsLike: number,
    readonly humidity: number,
    readonly windSpeed: number,
    readonly condition: WeatherCondition,
  ) {}
}
