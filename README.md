# Clima por ciudad

Aplicación de una sola página que muestra el clima actual y el pronóstico de cinco días de cualquier ciudad. TypeScript y Vite, sin frameworks, con arquitectura por capas y programación orientada a objetos.

Usa [Open-Meteo](https://open-meteo.com/) (geocodificación y pronóstico), que no necesita API key.

## Cómo correrlo

```bash
npm install
npm run dev
```

Otros scripts: `npm run build` (revisa tipos y genera `dist/`), `npm run preview`, `npm run typecheck`.

## Publicación

El proyecto se publica en GitHub Pages con el workflow de `.github/workflows/deploy.yml`: cada `push` a `main` instala dependencias, compila y despliega la carpeta `dist/`. En el repositorio hay que activar **Settings > Pages > Source: GitHub Actions**.

## Estructura

```
src/
  app/               clase App: orquesta la búsqueda y el ciclo de la interfaz
  domain/            el negocio, sin saber nada de la web ni del DOM
    entities/          Place, CurrentWeather, DayForecast, WeatherReport
    value-objects/     WeatherCondition
    errors/            DomainError y errores que ve el usuario
  application/       casos de uso
    ports/             interfaces que la infraestructura debe cumplir
    services/          WeatherService
    use-cases/         (vacía, para crecer)
  infrastructure/    todo lo que toca el exterior
    api/               OpenMeteoWeatherRepository y DTOs de la API
    http/              HttpClient, HttpError
    storage/           LocalStorageCityStorage
    config/            URLs y parámetros
  presentation/      todo lo que toca el DOM
    components/        Component (base), SearchForm, StatusMessage, WeatherView
    formatters/        WeatherFormatter
    dom/               helpers para consultar y crear elementos
    icons/             íconos SVG por tipo de clima
    styles/            style.css
  shared/            utilidades y tipos compartidos (vacía)
  assets/            imágenes e iconos (vacía)
  main.ts            composition root: crea y conecta todas las dependencias
tests/
  unit/  integration/  (vacías)
docs/                documentación adicional (vacía)
public/              archivos estáticos (favicon)
```

Las dependencias van en una sola dirección: `presentation` e `infrastructure` dependen de `application` y `domain`, nunca al revés. Por eso se puede cambiar Open-Meteo por otro proveedor sin tocar la interfaz.

Las rutas internas usan el alias `@/` (por ejemplo `@/domain/entities/Place`), configurado en `tsconfig.json` y `vite.config.ts`.

## POO aplicada

- **Encapsulación:** los estados internos son `private readonly`; las clases exponen solo lo necesario.
- **Abstracción y polimorfismo:** `WeatherService` depende de la interfaz `WeatherRepository`, no de la implementación concreta. Lo mismo pasa con `CityStorage`.
- **Herencia, solo donde aporta:** los componentes comparten `Component` (elemento raíz y búsqueda de hijos); los errores de negocio heredan de `DomainError`, y `App` los distingue con `instanceof`.
- **Inyección de dependencias:** las clases reciben lo que necesitan por el constructor. Solo `main.ts` usa `new` para armar el grafo.
- **Responsabilidad única:** una clase, una tarea (formatear, pedir datos, dibujar, guardar).

## Diseño

Estilo minimalista de alto contraste: pantalla dividida, con un bloque de color a la izquierda y el pronóstico sobre fondo neutro a la derecha.

- El color vive solo en el bloque principal y cambia con el clima (despejado, nublado, niebla, lluvia, nieve, tormenta). Lo decide `WeatherCondition.category` en el dominio y lo aplica `WeatherView` con `body[data-weather]`; los valores están solo en el CSS.
- Una sola tipografía, Manrope, con contraste de pesos: la temperatura va en peso 200 a gran tamaño y lo importante en 700.
- Cada día del pronóstico tiene una barra con su rango respecto al de toda la semana. Se coloca con variables CSS (`--from`, `--to`).
- El pronóstico usa container queries: la barra cambia de lugar según el ancho disponible.
- Una sola animación (la cifra aparece y las barras se dibujan), desactivada con `prefers-reduced-motion`.
- Tema claro y oscuro con `prefers-color-scheme`.

## Accesibilidad

- HTML semántico y jerarquía de títulos ordenada.
- Campo con `label` visible.
- Estados anunciados con `role="status"`.
- Foco visible y objetivos táctiles de al menos 44 px.
- Contraste revisado en tema claro y oscuro.
- Respeta `prefers-reduced-motion`.
- Todas las parejas de color del bloque superan el contraste 4.5:1.
- La cifra grande se oculta a lectores de pantalla y se lee una versión completa ("21 °C"). Íconos y barras son decorativos (`aria-hidden`).

## Diseño responsive

Parte de móvil: el bloque de color arriba y el pronóstico debajo. Desde 56 rem pasa a pantalla dividida. Usa `rem`, `clamp()` y container queries.

## Ideas para seguir

- Pruebas con Vitest en `tests/unit` (`WeatherService` con un repositorio falso es un buen primer caso).
- Alternar entre °C y °F.
- Botón "Usar mi ubicación" con `navigator.geolocation`.
