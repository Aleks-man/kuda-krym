export class UnsupportedRecommendationDateError extends Error {
  public constructor(public readonly date: string) {
    super(`Recommendation date ${date} must be today or tomorrow in Crimea`);
    this.name = "UnsupportedRecommendationDateError";
  }
}
