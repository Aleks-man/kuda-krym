import { describe, expect, it, vi } from "vitest";

import { PhotonClient } from "../../src/modules/departure-locations/photon/photon.client.js";

const response = {
  features: [
    feature("Николаевка", 33.614, 44.966, "Крым"),
    feature("Николаевка", 30.8, 46.9, "Одесская область"),
  ],
};

describe("PhotonClient", () => {
  it("searches settlement layers inside Crimea and maps results", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(response), { status: 200 }));
    const client = new PhotonClient({
      fetch: fetchMock,
      baseUrl: "https://photon.example.test/",
    });

    const locations = await client.search("Нико");
    const requestedUrl = fetchMock.mock.calls[0]?.[0] as URL;

    expect(requestedUrl.searchParams.get("bbox")).toBe(
      "32.3,44.35,36.75,46.25",
    );
    expect(requestedUrl.searchParams.getAll("layer")).toEqual([
      "city",
      "locality",
    ]);
    expect(locations).toEqual([
      {
        id: "osm:N:100",
        name: "Николаевка",
        context: "Симферопольский район · Крым",
        latitude: 44.966,
        longitude: 33.614,
      },
    ]);
  });

  it("reports an upstream HTTP error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));

    await expect(new PhotonClient({ fetch: fetchMock }).search("Саки")).rejects.toThrow(
      "Photon returned status 503",
    );
  });
});

function feature(
  name: string,
  longitude: number,
  latitude: number,
  state: string,
) {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [longitude, latitude] },
    properties: {
      name,
      osm_type: "N",
      osm_id: 100,
      county: "Симферопольский район",
      state,
      country: "Россия",
    },
  };
}
