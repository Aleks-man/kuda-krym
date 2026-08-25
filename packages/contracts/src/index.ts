export {
  beachDetailSchema,
  type BeachDetail,
} from "./beaches/beach-detail.contract.js";
export {
  apiErrorSchema,
  type ApiError,
} from "./common/api-error.contract.js";
export {
  beachListItemSchema,
  beachListResponseSchema,
  beachRegionSchema,
  beachSurfaceSchema,
  childSuitabilitySchema,
  type BeachListItem,
  type BeachListResponse,
} from "./beaches/beach-list.contract.js";
export {
  healthResponseSchema,
  type HealthResponse,
} from "./health/health.contract.js";
export {
  beachForecastSchema,
  type BeachForecast,
} from "./forecast/beach-forecast.contract.js";
export {
  forecastCoordinatesSchema,
  forecastHourSchema,
  type ForecastHour,
} from "./forecast/forecast-hour.contract.js";
export {
  coastalLocationListResponseSchema,
  coastalLocationSchema,
  waterBodySchema,
  type CoastalLocation,
  type CoastalLocationListResponse,
} from "./coastal-locations/coastal-location.contract.js";
export {
  coastalForecastSchema,
  type CoastalForecast,
} from "./coastal-locations/coastal-forecast.contract.js";
export {
  recommendationCompanySchema,
  recommendationDateSchema,
  recommendationOriginSchema,
  recommendationPrioritySchema,
  recommendationMaxTravelMinutesSchema,
  recommendationRequestSchema,
  recommendationSurfaceSchema,
  recommendationTimeSchema,
  type RecommendationRequest,
} from "./recommendations/recommendation-request.contract.js";
export {
  recommendationResponseSchema,
  type RecommendationResponse,
} from "./recommendations/recommendation-response.contract.js";
export {
  routePointSchema,
  routeRequestSchema,
  routeResponseSchema,
  type RoutePoint,
  type RouteRequest,
  type RouteResponse,
} from "./routing/route.contract.js";

