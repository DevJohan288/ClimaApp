export class Place {
  constructor(
    readonly name: string,
    readonly latitude: number,
    readonly longitude: number,
    readonly region?: string,
    readonly country?: string,
  ) {}

  get label(): string {
    return [this.name, this.region, this.country].filter(Boolean).join(", ");
  }
}
