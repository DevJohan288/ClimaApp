import type { CurrentWeather } from "./CurrentWeather";
import type { DayForecast } from "./DayForecast";
import type { Place } from "./Place";

export class WeatherReport {
  constructor(
    readonly place: Place,
    readonly current: CurrentWeather,
    readonly days: readonly DayForecast[],
  ) {}
}
