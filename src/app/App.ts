import type { CityStorage } from "@/application/ports/CityStorage";
import type { WeatherService } from "@/application/services/WeatherService";
import { DomainError } from "@/domain/errors/DomainError";
import type { SearchForm } from "@/presentation/components/SearchForm";
import type { StatusMessage } from "@/presentation/components/StatusMessage";
import type { WeatherView } from "@/presentation/components/WeatherView";

export interface AppDependencies {
  service: WeatherService;
  storage: CityStorage;
  searchForm: SearchForm;
  status: StatusMessage;
  view: WeatherView;
}

export class App {
  private static readonly DEFAULT_CITY = "Bogotá";

  private currentRequest: AbortController | null = null;

  constructor(private readonly deps: AppDependencies) {}

  start(): void {
    const { searchForm, storage } = this.deps;

    searchForm.onSubmit((city) => void this.search(city));

    const initialCity = storage.load() ?? App.DEFAULT_CITY;
    searchForm.setValue(initialCity);
    void this.search(initialCity);
  }

  private async search(city: string): Promise<void> {
    const { service, storage, status, view } = this.deps;

    // Si el usuario busca otra vez antes de que llegue la respuesta, cancelamos la anterior
    this.currentRequest?.abort();
    const controller = new AbortController();
    this.currentRequest = controller;

    view.setBusy(true);
    status.show("Buscando…");

    try {
      const report = await service.getByCity(city, controller.signal);
      view.render(report);
      storage.save(report.place.name);
      status.show(`Mostrando el clima de ${report.place.name}.`);
    } catch (error) {
      if (controller.signal.aborted) return;

      if (error instanceof DomainError) {
        status.showError(error.message);
      } else {
        console.error(error);
        status.showError("No se pudo cargar el clima. Revisa tu conexión e inténtalo de nuevo.");
      }
    } finally {
      if (this.currentRequest === controller) {
        view.setBusy(false);
        this.currentRequest = null;
      }
    }
  }
}
