import { describe, expect, it, vi } from "vitest";
import { OsrmClient } from "../../src/modules/routing/osrm/osrm.client.js";

const request = {
  origin: { latitude: 44.9521, longitude: 34.1024 },
  destination: { latitude: 44.644844, longitude: 33.536119 },
};

const validResponse = {
  code: "Ok",
  routes: [
    {
      distance: 78_240.4,
      duration: 4_380.2,
      geometry: {
        type: "LineString",
        coordinates: [
          [34.1024, 44.9521],
          [33.536119, 44.644844],
        ],
      },
    },
  ],
};

describe("OsrmClient", () => {
  it("requests and maps a driving route", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(validResponse), { status: 200 }),
    );
    const client = new OsrmClient({
      fetch: fetchMock,
      baseUrl: "https://osrm.example.test/",
      now: () => new Date("2026-08-24T09:30:00.000Z"),
    });

    const route = await client.getDrivingRoute(request);
    const requestedUrl = fetchMock.mock.calls[0]?.[0] as URL;

    expect(requestedUrl.pathname).toBe(
      "/route/v1/driving/34.1024,44.9521;33.536119,44.644844",
    );
    expect(requestedUrl.searchParams.get("geometries")).toBe("geojson");
    expect(route).toMatchObject({
      distanceMeters: 78_240,
      durationSeconds: 4_380,
      source: "OSRM",
      calculatedAt: "2026-08-24T09:30:00.000Z",
    });
  });

  it("rejects a response without a route", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ code: "NoRoute", routes: [] }), {
        status: 200,
      }),
    );

    await expect(
      new OsrmClient({ fetch: fetchMock }).getDrivingRoute(request),
    ).rejects.toThrow("OSRM could not build a route: NoRoute");
  });

  it("reports an upstream HTTP error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));

    await expect(
      new OsrmClient({ fetch: fetchMock }).getDrivingRoute(request),
    ).rejects.toThrow("OSRM returned status 503");
  });
});

it("shares four upstream slots across clients and removes a cancelled queued request", async () => {
  const complete: Array<() => void> = [];
  const fetchMock = vi.fn<typeof fetch>(async () => new Promise<Response>(resolve => {
    complete.push(() => resolve(new Response(JSON.stringify(validResponse))));
  }));
  const clients = [new OsrmClient({ fetch: fetchMock }), new OsrmClient({ fetch: fetchMock })];
  const cancelled = new AbortController();
  const requests = Array.from({ length: 6 }, (_, index) =>
    clients[index % 2]!.getDrivingRoute({
      ...request,
      ...(index === 4 ? { signal: cancelled.signal } : {}),
    }),
  );
  const settled = Promise.allSettled(requests);
  expect(fetchMock).toHaveBeenCalledTimes(4);
  cancelled.abort();
  complete[0]!();
  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(5));
  for (const resolve of complete.slice(1)) resolve();
  const results = await settled;
  expect(results.filter(result => result.status === "fulfilled")).toHaveLength(5);
  expect(results[4]?.status).toBe("rejected");
});
