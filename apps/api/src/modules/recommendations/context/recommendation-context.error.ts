export class UnsupportedRecommendationDateError extends Error {
  public constructor(public readonly date: string) {
    super(
      `Recommendation date ${date} must be today, tomorrow or the day after tomorrow in Crimea`,
    );
    this.name = "UnsupportedRecommendationDateError";
  }
}

export class UnsupportedRecommendationOriginError extends Error {
  public constructor(public readonly originId: string) {
    super(`Recommendation origin ${originId} must be located in Crimea`);
    this.name = "UnsupportedRecommendationOriginError";
  }
}
