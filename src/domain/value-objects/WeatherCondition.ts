// Códigos WMO que usa Open-Meteo: https://open-meteo.com/en/docs
const DESCRIPTIONS: Readonly<Record<number, string>> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada",
  61: "Lluvia ligera",
  63: "Lluvia",
  65: "Lluvia fuerte",
  66: "Lluvia helada ligera",
  67: "Lluvia helada",
  71: "Nevada ligera",
  73: "Nevada",
  75: "Nevada fuerte",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos",
  82: "Chubascos violentos",
  85: "Chubascos de nieve",
  86: "Chubascos de nieve fuertes",
  95: "Tormenta eléctrica",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo fuerte",
};

export type WeatherCategory = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

export class WeatherCondition {
  constructor(readonly code: number) {}

  get description(): string {
    return DESCRIPTIONS[this.code] ?? "Condición desconocida";
  }

  // Agrupa los códigos WMO en las familias que la interfaz sabe dibujar
  get category(): WeatherCategory {
    const c = this.code;
    if (c <= 1) return "clear";
    if (c === 2 || c === 3) return "cloudy";
    if (c === 45 || c === 48) return "fog";
    if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return "rain";
    if ((c >= 71 && c <= 77) || c === 85 || c === 86) return "snow";
    if (c >= 95) return "storm";
    return "cloudy";
  }

  equals(other: WeatherCondition): boolean {
    return this.code === other.code;
  }
}
