import { afterEach, describe, expect, it, vi } from "vitest";

import { requestDepartureLocations } from "./request-departure-locations";

const responseBody = {
  data: [
    {
      id: "osm:N:100",
      name: "Николаевка",
      context: "Симферопольский район · Крым",
      latitude: 44.966,
      longitude: 33.614,
    },
  ],
};

describe("requestDepartureLocations", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("forwards an encoded query to the API", async () => {
    vi.stubEnv("API_URL", "https://api.example.test");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(responseBody)));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      requestDepartureLocations(" Нико ", { "x-request-id": "request-1" }),
    ).resolves.toEqual(responseBody);

    const [requestedUrl, options] = fetchMock.mock.calls[0] ?? [];
    expect((requestedUrl as URL).searchParams.get("query")).toBe("Нико");
    expect(options?.headers).toEqual({ "x-request-id": "request-1" });
  });

  it("preserves an API error", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { code: "LOCATION_PROVIDER_UNAVAILABLE", message: "Ошибка" },
        }),
        { status: 502 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      requestDepartureLocations("Нико", {}),
    ).rejects.toMatchObject({
      code: "LOCATION_PROVIDER_UNAVAILABLE",
      status: 502,
    });
  });
});
