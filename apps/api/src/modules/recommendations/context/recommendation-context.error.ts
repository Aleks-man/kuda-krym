export class UnsupportedRecommendationDateError extends Error {
  public constructor(public readonly date: string) {
    super(
      `Recommendation date ${date} must be today, tomorrow or the day after tomorrow in Crimea`,
    );
    this.name = "UnsupportedRecommendationDateError";
  }
}
