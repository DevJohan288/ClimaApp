import { Component } from "./Component";

export class StatusMessage extends Component<HTMLParagraphElement> {
  show(message: string): void {
    this.root.textContent = message;
    this.root.classList.remove("status--error");
  }

  showError(message: string): void {
    this.root.textContent = message;
    this.root.classList.add("status--error");
  }
}
