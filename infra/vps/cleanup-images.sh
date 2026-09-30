#!/usr/bin/env bash
set -euo pipefail

# Preview by default. Run only when no deployment/pull is in progress.
if [[ $# -lt 2 || $# -gt 3 || ( $# -eq 3 && "$3" != "--apply" ) ]]; then
  echo "Usage: bash cleanup-images.sh CURRENT_SHA ROLLBACK_SHA [--apply]" >&2
  exit 2
fi
current="$1"
rollback="$2"
if [[ ! "$current" =~ ^[0-9a-f]{40}$ || ! "$rollback" =~ ^[0-9a-f]{40}$ || "$current" == "$rollback" ]]; then
  echo "Provide two different full commit SHAs: current and rollback." >&2
  exit 2
fi

repositories=(ghcr.io/aleks-man/kuda-krym-web ghcr.io/aleks-man/kuda-krym-api ghcr.io/aleks-man/kuda-krym-migrator)
declare -A protected=()
# Refuse cleanup if either complete release is unavailable locally.
for repository in "${repositories[@]}"; do
  for tag in "$current" "$rollback"; do
    id=$(docker image inspect --format '{{.Id}}' "$repository:$tag")
    protected["$id"]=1
  done
done

protect_containers() {
  local containers id images
  containers=$(docker container ls -aq)
  if [[ -n "$containers" ]]; then
    images=$(docker container inspect --format '{{.Image}}' $containers)
    while IFS= read -r id; do
      protected["$id"]=1
    done <<< "$images"
  fi
}
protect_containers
images=$(docker image ls --no-trunc --format '{{.Repository}} {{.Tag}} {{.ID}}')
while read -r repository tag id; do
  case "$repository" in
    ghcr.io/aleks-man/kuda-krym-web|ghcr.io/aleks-man/kuda-krym-api|ghcr.io/aleks-man/kuda-krym-migrator) ;;
    *) continue ;;
  esac
  [[ "$tag" =~ ^[0-9a-f]{40}$ ]] || continue
  [[ -z "${protected[$id]:-}" ]] || continue
  if [[ "${3:-}" == "--apply" ]]; then
    protect_containers
    [[ -z "${protected[$id]:-}" ]] || continue
    echo "Removing $repository:$tag"
    docker image rm "$repository:$tag"
  else
    echo "Would remove $repository:$tag"
  fi
done <<< "$images"
echo "Current and rollback releases, container images, volumes and other projects are preserved."
