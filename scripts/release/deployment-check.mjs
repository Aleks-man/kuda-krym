const checks = [
  {
    name: "web application",
    target: "web",
    pathname: "/",
    validate: async (response) =>
      response.headers.get("content-type")?.includes("text/html") ?? false,
  },
  {
    name: "robots.txt",
    target: "web",
    pathname: "/robots.txt",
    validate: async (response) => (await response.text()).includes("User-Agent"),
  },
  {
    name: "sitemap.xml",
    target: "web",
    pathname: "/sitemap.xml",
    validate: async (response) => (await response.text()).includes("<urlset"),
  },
  {
    name: "API liveness",
    target: "api",
    pathname: "/api/health/live",
    validate: async (response) => (await response.json()).status === "ok",
  },
  {
    name: "API readiness",
    target: "api",
    pathname: "/api/health/ready",
    validate: async (response) => {
      const body = await response.json();
      return body.status === "ready" && body.checks?.database === "up";
    },
  },
];

export async function checkDeployment({ webUrl, apiUrl, fetchImpl = fetch }) {
  const origins = {
    web: parseOrigin("webUrl", webUrl),
    api: parseOrigin("apiUrl", apiUrl),
  };
  const results = [];

  for (const check of checks) {
    const url = new URL(check.pathname, origins[check.target]);

    try {
      const response = await fetchImpl(url, {
        headers: { accept: "application/json, text/plain, text/html" },
        signal: AbortSignal.timeout(10_000),
      });
      const valid = response.ok && (await check.validate(response));
      results.push({ name: check.name, url: url.href, ok: valid });
    } catch (error) {
      results.push({
        name: check.name,
        url: url.href,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

function parseOrigin(name, value) {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  const url = new URL(value);
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error(`${name} must contain only an origin`);
  }

  return url;
}
