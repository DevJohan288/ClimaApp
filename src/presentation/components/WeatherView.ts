import type { DayForecast } from "@/domain/entities/DayForecast";
import type { WeatherReport } from "@/domain/entities/WeatherReport";
import { el } from "../dom/dom";
import type { WeatherFormatter } from "../formatters/WeatherFormatter";
import { createWeatherIcon } from "../icons/weatherIcons";
import { Component } from "./Component";

// Rango de temperaturas de toda la semana, para dibujar la barra de cada día
interface TemperatureScale {
  lowest: number;
  span: number;
}

export class WeatherView extends Component<HTMLElement> {
  private readonly current: HTMLElement;
  private readonly forecast: HTMLElement;

  constructor(
    root: HTMLElement,
    private readonly formatter: WeatherFormatter,
  ) {
    super(root);
    this.current = this.find("#current");
    this.forecast = this.find("#forecast");
  }

  setBusy(busy: boolean): void {
    for (const panel of [this.current, this.forecast]) {
      if (busy) {
        panel.setAttribute("aria-busy", "true");
      } else {
        panel.removeAttribute("aria-busy");
      }
    }
  }

  render(report: WeatherReport): void {
    // Todo se arma con textContent: nada de lo que venga de la API pasa por innerHTML
    this.current.replaceChildren(...this.buildCurrent(report));
    this.forecast.replaceChildren(...this.buildForecast(report.days));
    this.current.hidden = false;
    this.forecast.hidden = false;

    // El CSS elige el color del bloque principal según esta categoría
    document.body.dataset.weather = report.current.condition.category;
  }

  private buildCurrent({ place, current }: WeatherReport): HTMLElement[] {
    const title = el("h2", "current__place", place.label);

    // La cifra grande se oculta a los lectores de pantalla; ellos leen la versión completa
    const temperature = el("p", "current__temp");
    const spoken = el("span", "visually-hidden", this.formatter.temperature(current.temperature));
    const visual = el("span", undefined, this.formatter.degrees(current.temperature));
    visual.setAttribute("aria-hidden", "true");
    temperature.append(spoken, visual);

    const summary = el("p", "current__summary");
    summary.append(createWeatherIcon(current.condition.category), current.condition.description);

    const details = el("dl", "details");
    this.addDetail(details, "Sensación térmica", this.formatter.temperature(current.feelsLike));
    this.addDetail(details, "Humedad", this.formatter.humidity(current.humidity));
    this.addDetail(details, "Viento", this.formatter.windSpeed(current.windSpeed));

    return [title, temperature, summary, details];
  }

  private addDetail(list: HTMLDListElement, label: string, value: string): void {
    const row = el("div");
    row.append(el("dt", undefined, label), el("dd", undefined, value));
    list.append(row);
  }

  private buildForecast(days: readonly DayForecast[]): HTMLElement[] {
    const title = el("h2", "forecast__title", `Próximos ${days.length} días`);

    const lowest = Math.min(...days.map((day) => day.min));
    const highest = Math.max(...days.map((day) => day.max));
    const scale: TemperatureScale = { lowest, span: highest - lowest || 1 };

    const list = el("ul", "forecast__list");
    days.forEach((day, index) => list.append(this.buildDay(day, index, scale)));

    return [title, list];
  }

  private buildDay(day: DayForecast, index: number, scale: TemperatureScale): HTMLLIElement {
    const item = el("li", "day");
    item.style.setProperty("--i", String(index)); // para escalonar la animación de las barras

    const icon = createWeatherIcon(day.condition.category);
    icon.classList.add("day__icon");

    const name = el("time", "day__name", index === 0 ? "Hoy" : this.formatter.dayLabel(day.date));
    name.dateTime = day.date;

    const max = el("p", "day__max");
    max.append(el("span", "visually-hidden", "Máxima "), this.formatter.degrees(day.max));
    const min = el("p", "day__min");
    min.append(el("span", "visually-hidden", "Mínima "), this.formatter.degrees(day.min));
    const range = el("div", "day__range");
    range.append(max, min);

    // Decorativa: los valores ya están escritos en el rango
    const bar = el("span", "day__bar");
    bar.setAttribute("aria-hidden", "true");
    bar.style.setProperty("--from", `${((day.min - scale.lowest) / scale.span) * 100}%`);
    bar.style.setProperty("--to", `${((day.max - scale.lowest) / scale.span) * 100}%`);

    item.append(icon, name, el("p", "day__desc", day.condition.description), range, bar);
    return item;
  }
}
