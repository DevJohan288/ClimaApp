export class WeatherFormatter {
  private readonly celsius = new Intl.NumberFormat("es", {
    style: "unit",
    unit: "celsius",
    maximumFractionDigits: 0,
  });
  private readonly percent = new Intl.NumberFormat("es", { style: "unit", unit: "percent" });
  private readonly kmh = new Intl.NumberFormat("es", {
    style: "unit",
    unit: "kilometer-per-hour",
    maximumFractionDigits: 0,
  });
  private readonly day = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  temperature(value: number): string {
    return this.celsius.format(value);
  }

  // Versión corta para la cifra grande: "21°"
  degrees(value: number): string {
    return `${Math.round(value) || 0}°`;
  }

  humidity(value: number): string {
    return this.percent.format(value);
  }

  windSpeed(value: number): string {
    return this.kmh.format(value);
  }

  dayLabel(isoDate: string): string {
    return this.day.format(WeatherFormatter.parseLocalDate(isoDate));
  }

  // new Date("2026-10-07") se interpreta como UTC y puede mostrar el día anterior
  private static parseLocalDate(iso: string): Date {
    const [year, month, day] = iso.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
}
