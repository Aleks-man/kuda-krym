import { afterEach, describe, expect, it, vi } from "vitest";
import { metrikaId, trackGoal, trackPageView } from "./metrika";

function browser(hostname = "kudakrym.ru") {
  const location = { hostname, href: "https://" + hostname + "/" };
  const append = vi.fn();
  vi.stubGlobal("window", { location });
  vi.stubGlobal("document", {
    referrer: "https://example.org/", title: "Kuda Krym",
    getElementById: () => null, createElement: () => ({}), head: { appendChild: append },
  });
  return { location, append };
}
afterEach(() => vi.unstubAllGlobals());

describe("Yandex Metrika", () => {
  it("initializes once and sends one hit for each navigation", () => {
    const { location, append } = browser();
    trackPageView();
    trackPageView();
    location.href = "https://kudakrym.ru/coast";
    trackPageView();
    const calls = window.ym!.a!;
    expect(calls.filter(call => call[1] === "init")).toHaveLength(1);
    expect(calls[0]?.[2]).toMatchObject({ defer: true, webvisor: true });
    expect(calls.filter(call => call[1] === "hit")).toHaveLength(2);
    expect(calls.at(-1)).toEqual([metrikaId, "hit", location.href, { title: "Kuda Krym", referer: "https://kudakrym.ru/" }]);
    expect(append).toHaveBeenCalledOnce();
    expect(append.mock.calls[0]?.[0]).toMatchObject({ async: true, src: "https://mc.yandex.ru/metrika/tag.js?id=112933626" });
  });
  it.each(["localhost", "127.0.0.1", "test.kudakrym.ru", "preview.vercel.app"])("does not collect traffic from %s", hostname => {
    const { append } = browser(hostname);
    trackPageView();
    trackGoal("recommendation_submit");
    expect(append).not.toHaveBeenCalled();
    expect(window.ym).toBeUndefined();
  });
  it("queues goals without form values and tolerates a blocked or throwing counter", () => {
    browser();
    trackGoal("recommendation_results");
    expect(window.ym!.a!.at(-1)).toEqual([metrikaId, "reachGoal", "recommendation_results"]);
    window.ym = () => { throw new Error("blocked"); };
    expect(() => trackGoal("recommendation_submit")).not.toThrow();
    expect(() => trackPageView()).not.toThrow();
  });
  it("does nothing during server rendering", () => {
    vi.stubGlobal("window", undefined);
    expect(() => trackPageView()).not.toThrow();
    expect(() => trackGoal("recommendation_submit")).not.toThrow();
  });
});
