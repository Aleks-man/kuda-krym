#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/opt/kuda-krym"
NEW_TAG="${1:-}"
if [[ ! "$NEW_TAG" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Expected a full 40-character commit SHA." >&2
  exit 2
fi

cd "$APP_DIR"
exec 9>"$APP_DIR/.deploy.lock"
flock -n 9 || { echo "Another deployment is in progress." >&2; exit 1; }

on_error() {
  echo "Deployment failed; automatic image cleanup was not run."
  docker compose ps
}
trap on_error ERR

# Capture the actual healthy release, not .env (which may reflect a failed deploy).
PREVIOUS_TAG=""
API_IMAGE="$(docker inspect -f '{{.Config.Image}}' kuda-krym-api-1 2>/dev/null || true)"
WEB_IMAGE="$(docker inspect -f '{{.Config.Image}}' kuda-krym-web-1 2>/dev/null || true)"
API_HEALTH="$(docker inspect -f '{{.State.Health.Status}}' kuda-krym-api-1 2>/dev/null || true)"
WEB_HEALTH="$(docker inspect -f '{{.State.Health.Status}}' kuda-krym-web-1 2>/dev/null || true)"
if [[ "$API_IMAGE" =~ ^ghcr.io/aleks-man/kuda-krym-api:([0-9a-f]{40})$ ]]; then
  tag="${BASH_REMATCH[1]}"
  if [[ "$WEB_IMAGE" == "ghcr.io/aleks-man/kuda-krym-web:$tag" && "$API_HEALTH" == healthy && "$WEB_HEALTH" == healthy ]]; then
    PREVIOUS_TAG="$tag"
  fi
fi
if [[ "$PREVIOUS_TAG" == "$NEW_TAG" ]]; then
  PREVIOUS_TAG=""
  if [[ -f .rollback-image-tag ]]; then
    read -r PREVIOUS_TAG < .rollback-image-tag || true
  fi
fi

echo "Checking configuration..."
IMAGE_TAG="$NEW_TAG" docker compose config --quiet
echo "Pulling images $NEW_TAG..."
IMAGE_TAG="$NEW_TAG" docker compose pull migrate api web

# Require one existing assignment before updating the deployment configuration.
[[ "$(grep -c '^IMAGE_TAG=' .env)" == 1 ]]
sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$NEW_TAG/" .env

echo "Running migrations..."
docker compose run --rm migrate
echo "Updating application..."
docker compose up -d api web caddy

for attempt in {1..30}; do
  API_STATUS="$(docker inspect -f '{{.State.Health.Status}}' kuda-krym-api-1 2>/dev/null || true)"
  WEB_STATUS="$(docker inspect -f '{{.State.Health.Status}}' kuda-krym-web-1 2>/dev/null || true)"
  if [[ "$API_STATUS" == healthy && "$WEB_STATUS" == healthy ]]; then
    docker compose exec -T caddy wget -qO- http://api:4000/api/health/ready >/dev/null
    curl -fsS https://kudakrym.ru/ >/dev/null
    echo "Deployment $NEW_TAG completed successfully."

    if [[ "$PREVIOUS_TAG" =~ ^[0-9a-f]{40}$ && "$PREVIOUS_TAG" != "$NEW_TAG" ]]; then
      printf '%s\n' "$PREVIOUS_TAG" > .rollback-image-tag
      if ! bash /usr/local/sbin/kuda-krym-cleanup-images "$NEW_TAG" "$PREVIOUS_TAG" --apply; then
        echo "WARNING: image cleanup failed; application deployment succeeded." >&2
      fi
    else
      echo "Cleanup skipped: no confirmed previous release for rollback."
    fi
    exit 0
  fi
  sleep 2
done
echo "Containers did not become healthy within 60 seconds." >&2
docker compose ps
exit 1
