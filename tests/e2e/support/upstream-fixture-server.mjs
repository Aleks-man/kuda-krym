import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 4200);
const forecastPaths = new Set(["/v1/ecmwf", "/v1/dwd-icon", "/v1/gfs"]);

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);

  if (url.pathname === "/health") return sendJson(response, { status: "ok" });
  if (url.pathname === "/v1/forecast") {
    return sendJson(response, createWeatherResponse(url));
  }
  if (url.pathname === "/v1/marine") {
    if (process.env.E2E_MARINE_UNAVAILABLE === "1") return sendJson(response, { error: "Marine temporarily unavailable" }, 503);
    return sendJson(response, createMarineResponse(url));
  }
  if (forecastPaths.has(url.pathname)) {
    return sendJson(response, createModelResponse(url));
  }

  sendJson(response, { error: "Not found" }, 404);
});

server.listen(port, "127.0.0.1");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

function createWeatherResponse(url) {
  const time = createHourlyTimes();
  const dailyTime = createDailyTimes(url);
  return {
    ...coordinates(url),
    timezone: "GMT",
    ...(url.searchParams.has("current") && process.env.E2E_CURRENT_UNAVAILABLE !== "1" ? { current: {
      time: new Date(Math.floor(Date.now() / 900_000) * 900_000).toISOString().slice(0, 16),
      interval: 900, temperature_2m: 21, apparent_temperature: 19.2,
      relative_humidity_2m: 65, surface_pressure: 1013.25, visibility: 24000, uv_index: 4.2,
      precipitation: 2.3, wind_speed_10m: 3.2, wind_direction_10m: 225, wind_gusts_10m: 5.1,
      cloud_cover: 90, weather_code: 82, is_day: 1,
    } } : {}),
    daily: {
      time: dailyTime,
      sunrise: dailyTime.map((date) => `${date}T03:00`),
      sunset: dailyTime.map((date) => `${date}T16:00`),
    },
    hourly: {
      time,
      temperature_2m: values(time, 26),
      ...(url.searchParams.get("hourly")?.split(",").includes("surface_pressure") ? { surface_pressure: values(time, 1013.25) } : {}),
      ...(url.searchParams.get("hourly")?.split(",").includes("visibility") ? { visibility: values(time, 24000) } : {}),
      ...(url.searchParams.get("hourly")?.split(",").includes("uv_index")
        ? { uv_index: time.map((_, index) => index === 3 ? 6 : index === 4 ? 8 : index === 5 ? 11 : 4.2) }
        : {}),
      ...(url.searchParams.get("hourly")?.split(",").includes("relative_humidity_2m")
        ? { relative_humidity_2m: values(time, 65) }
        : {}),
      ...(url.searchParams.get("hourly")?.split(",").includes("apparent_temperature")
        ? { apparent_temperature: values(time, 29.2) }
        : {}),
      precipitation_probability: values(time, 8),
      precipitation: values(time, 0),
      wind_speed_10m: values(time, 3.2),
      wind_direction_10m: values(time, 225),
      wind_gusts_10m: values(time, 5.1),
      cloud_cover: values(time, 18),
    },
  };
}

function createMarineResponse(url) {
  const time = createHourlyTimes();
  const dailyTime = createDailyTimes(url);
  return {
    ...coordinates(url),
    timezone: "GMT",
    hourly: {
      time,
      sea_surface_temperature: values(time, 24.5),
      wave_height: values(time, 0.3),
      wave_direction: values(time, 210),
      wave_period: values(time, 4.2),
    },
  };
}

function createModelResponse(url) {
  const weather = createWeatherResponse(url);
  const { precipitation_probability: _probability, ...hourly } = weather.hourly;
  return { ...weather, hourly };
}

function createHourlyTimes() {
  const firstHour = new Date();
  firstHour.setUTCMinutes(0, 0, 0);
  return Array.from({ length: 72 }, (_, index) =>
    new Date(firstHour.getTime() + index * 3_600_000)
      .toISOString()
      .slice(0, 16),
  );
}

function createDailyTimes(url) {
  const dayCount = Number(url.searchParams.get("forecast_days") ?? 3);
  const firstDay = new Date();
  firstDay.setUTCHours(0, 0, 0, 0);
  return Array.from({ length: dayCount }, (_, index) =>
    new Date(firstDay.getTime() + index * 86_400_000)
      .toISOString()
      .slice(0, 10),
  );
}

function coordinates(url) {
  return {
    latitude: Number(url.searchParams.get("latitude")),
    longitude: Number(url.searchParams.get("longitude")),
  };
}

function values(time, value) {
  return time.map(() => value);
}

function sendJson(response, body, status = 200) {
  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
}
