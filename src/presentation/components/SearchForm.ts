import { Component } from "./Component";

export class SearchForm extends Component<HTMLFormElement> {
  private readonly input: HTMLInputElement;

  constructor(root: HTMLFormElement) {
    super(root);
    this.input = this.find<HTMLInputElement>("#city");
  }

  setValue(city: string): void {
    this.input.value = city;
  }

  onSubmit(handler: (city: string) => void): void {
    this.root.addEventListener("submit", (event) => {
      event.preventDefault();
      handler(this.input.value);
    });
  }
}
