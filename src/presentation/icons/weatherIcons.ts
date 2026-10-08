import type { WeatherCategory } from "@/domain/value-objects/WeatherCondition";

const SVG_NS = "http://www.w3.org/2000/svg";

const SHAPES: Readonly<Record<WeatherCategory, readonly string[]>> = {
  clear: [
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
    "M12 2v2M12 20v2M2 12h2M20 12h2",
    "M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41",
  ],
  cloudy: ["M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"],
  fog: ["M4 8h16", "M3 12h18", "M6 16h12", "M9 20h6"],
  rain: [
    "M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25",
    "M8 13v2M8 19v2M12 15v2M12 21v2M16 13v2M16 19v2",
  ],
  snow: [
    "M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25",
    "M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01",
  ],
  storm: ["M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9", "M13 11l-4 6h6l-4 6"],
};

// Los íconos son decorativos: el texto de la condición ya está en pantalla.
export function createWeatherIcon(category: WeatherCategory): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.6");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  for (const d of SHAPES[category]) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}
