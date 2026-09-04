import { afterEach, describe, expect, it, vi } from "vitest";

import { getCoastalLocationBeaches } from "./get-coastal-location-beaches";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("getCoastalLocationBeaches", () => {
  it("loads and validates beaches for an encoded location slug", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        location: {
          id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
          slug: "мыс-фиолент",
          name: "Фиолент",
          region: "SEVASTOPOL",
          waterBody: "BLACK_SEA",
          weatherCoordinates: { latitude: 44.53, longitude: 33.48 },
          marineCoordinates: { latitude: 44.51, longitude: 33.47 },
          coverImage: null,
        },
        data: [],
        meta: { total: 0 },
      }),
    );
    vi.stubEnv("API_URL", "https://api.example.test");
    vi.stubGlobal("fetch", fetchMock);

    const result = await getCoastalLocationBeaches("мыс-фиолент");

    expect(result?.location.slug).toBe("мыс-фиолент");
    expect(fetchMock).toHaveBeenCalledWith(
      new URL(
        "https://api.example.test/api/coastal-locations/%D0%BC%D1%8B%D1%81-%D1%84%D0%B8%D0%BE%D0%BB%D0%B5%D0%BD%D1%82/beaches",
      ),
      { next: { revalidate: 300 } },
    );
  });

  it("returns null when the coastal location is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );

    await expect(getCoastalLocationBeaches("unknown")).resolves.toBeNull();
  });
});
