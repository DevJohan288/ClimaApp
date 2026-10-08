export interface OpenMeteoConfig {
  geocodingUrl: string;
  forecastUrl: string;
  forecastDays: number;
}

export const openMeteoConfig: OpenMeteoConfig = {
  geocodingUrl: "https://geocoding-api.open-meteo.com/v1/search",
  forecastUrl: "https://api.open-meteo.com/v1/forecast",
  forecastDays: 5,
};
