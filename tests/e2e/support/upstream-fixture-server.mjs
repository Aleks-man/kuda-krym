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
  return {
    ...coordinates(url),
    timezone: "GMT",
    hourly: {
      time,
      temperature_2m: values(time, 26),
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
  return Array.from({ length: 48 }, (_, index) =>
    new Date(firstHour.getTime() + index * 3_600_000)
      .toISOString()
      .slice(0, 16),
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
