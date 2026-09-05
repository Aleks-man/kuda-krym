export function parseEnvFile(contents) {
  const environment = {};

  for (const sourceLine of contents.split(/\r?\n/u)) {
    const line = sourceLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator < 1) {
      continue;
    }

    const name = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    environment[name] = stripMatchingQuotes(rawValue);
  }

  return environment;
}

function stripMatchingQuotes(value) {
  const first = value.at(0);
  const last = value.at(-1);

  if ((first === '"' || first === "'") && first === last) {
    return value.slice(1, -1);
  }

  return value;
}
