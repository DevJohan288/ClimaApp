import type { WeatherCondition } from "../value-objects/WeatherCondition";

export class DayForecast {
  constructor(
    readonly date: string, // YYYY-MM-DD, tal como lo entrega la API
    readonly max: number,
    readonly min: number,
    readonly condition: WeatherCondition,
  ) {}
}
