import {
  apiErrorSchema,
  routeResponseSchema,
  type RouteRequest,
} from "@kuda-krym/contracts";

export async function submitRoute(request: RouteRequest) {
  const response = await fetch("/api/routes", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request),
  });
  const body: unknown = await response.json();

  if (!response.ok) {
    const error = apiErrorSchema.safeParse(body);
    throw new Error(
      error.success ? error.data.error.message : "Не удалось построить маршрут",
    );
  }

  return routeResponseSchema.parse(body);
}
