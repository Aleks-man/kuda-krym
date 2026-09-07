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
      "district",
    ]);
    expect(locations).toEqual([
      {
        id: "osm:N:100",
        name: "Николаевка",
        context: "Симферопольский район",
        latitude: 44.966,
        longitude: 33.614,
      },
    ]);
    expect(requestedUrl.searchParams.has("lang")).toBe(false);
  });

  it("reports an upstream HTTP error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));

    await expect(new PhotonClient({ fetch: fetchMock }).search("Саки")).rejects.toThrow(
      "Photon returned status 503",
    );
  });

  it("keeps a settlement classified as a district and drops a boundary", async () => {
    const payload = {
      features: [
        photonFeature(
          "Первомайское",
          33.864073,
          45.7124068,
          "Автономна Республіка Крим",
          "town",
        ),
        {
          ...photonFeature(
            "Первомайское сельское поселение",
            33.8644406,
            45.7199761,
            "Автономна Республіка Крим",
            "city",
          ),
          properties: {
            ...photonFeature("", 0, 0, "", "city").properties,
            name: "Первомайское сельское поселение",
            osm_key: "boundary",
            osm_value: "administrative",
            state: "Автономна Республіка Крим",
          },
        },
      ],
    };
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify(payload), { status: 200 }));

    const locations = await new PhotonClient({ fetch: fetchMock }).search(
      "Первомайское",
    );

    expect(locations).toHaveLength(1);
    expect(locations[0]).toMatchObject({
      name: "Первомайское",
      latitude: 45.7124068,
      longitude: 33.864073,
    });
  });
});

function feature(
  name: string,
  longitude: number,
  latitude: number,
  state: string,
) {
  return photonFeature(name, longitude, latitude, state, "village");
}

function photonFeature(
  name: string,
  longitude: number,
  latitude: number,
  state: string,
  placeType: string,
) {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [longitude, latitude] },
    properties: {
      name,
      osm_type: "N",
      osm_id: 100,
      osm_key: "place",
      osm_value: placeType,
      county: "Симферопольский район",
      state,
      country: "Россия",
    },
  };
}
