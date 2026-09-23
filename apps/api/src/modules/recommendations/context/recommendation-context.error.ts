export class UnsupportedRecommendationDateError extends Error {
  public constructor(public readonly date: string) {
    super(
      `Recommendation date ${date} must be within the next seven calendar days, including today, in Crimea`,
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
