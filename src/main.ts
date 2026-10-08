import "@fontsource-variable/manrope";
import "./presentation/styles/style.css";

import { App } from "@/app/App";
import { WeatherService } from "@/application/services/WeatherService";
import { OpenMeteoWeatherRepository } from "@/infrastructure/api/OpenMeteoWeatherRepository";
import { openMeteoConfig } from "@/infrastructure/config/apiConfig";
import { HttpClient } from "@/infrastructure/http/HttpClient";
import { LocalStorageCityStorage } from "@/infrastructure/storage/LocalStorageCityStorage";
import { SearchForm } from "@/presentation/components/SearchForm";
import { StatusMessage } from "@/presentation/components/StatusMessage";
import { WeatherView } from "@/presentation/components/WeatherView";
import { queryRequired } from "@/presentation/dom/dom";
import { WeatherFormatter } from "@/presentation/formatters/WeatherFormatter";

// Único lugar donde se crean las dependencias y se conectan entre sí.
const repository = new OpenMeteoWeatherRepository(new HttpClient(), openMeteoConfig);

const app = new App({
  service: new WeatherService(repository),
  storage: new LocalStorageCityStorage("clima:ultima-ciudad"),
  searchForm: new SearchForm(queryRequired<HTMLFormElement>("#search-form")),
  status: new StatusMessage(queryRequired<HTMLParagraphElement>("#status")),
  view: new WeatherView(queryRequired<HTMLElement>("#app"), new WeatherFormatter()),
});

app.start();
