import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const bash = process.platform === "win32" ? "C:/Program Files/Git/bin/bash.exe" : "bash";
const current = "a".repeat(40);
const rollback = "b".repeat(40);
const old = "c".repeat(40);
const used = "d".repeat(40);
const script = resolve("infra/vps/cleanup-images.sh");
function run(args, missing = false) {
  const dir = mkdtempSync(join(tmpdir(), "kuda-cleanup-"));
  const fixture = join(dir, "mock.sh");
  const log = join(dir, "removed.txt");
  writeFileSync(fixture, `docker() {
    if [[ "$1 $2" == "image inspect" ]]; then
      [[ "${missing}" != "true" ]] || return 1
      case "${'$'}{!#}" in
        *:${current}) echo sha256:current ;;
        *:${rollback}) echo sha256:rollback ;;
      esac
    elif [[ "$1 $2" == "container ls" ]]; then
      echo container
    elif [[ "$1 $2" == "container inspect" ]]; then
      echo sha256:used
    elif [[ "$1 $2" == "image ls" ]]; then
      echo "ghcr.io/aleks-man/kuda-krym-web ${current} sha256:current"
      echo "ghcr.io/aleks-man/kuda-krym-web ${rollback} sha256:rollback"
      echo "ghcr.io/aleks-man/kuda-krym-web ${old} sha256:old"
      echo "ghcr.io/aleks-man/kuda-krym-api ${used} sha256:used"
      echo "ghcr.io/aleks-man/kuda-krym-web latest sha256:latest"
      echo "other/project ${old} sha256:other"
    elif [[ "$1 $2" == "image rm" ]]; then
      echo "$3" >> "$REMOVAL_LOG"
    else
      return 99
    fi
  }
`);
  try {
    const result = spawnSync(bash, [script, ...args], {
      encoding: "utf8",
      env: { ...process.env, BASH_ENV: fixture, REMOVAL_LOG: log },
    });
    return { ...result, removed: existsSync(log) ? readFileSync(log, "utf8").trim() : "" };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
test("preview does not delete images", () => {
  const r = run([current, rollback]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.removed, "");
  assert.match(r.stdout, /Would remove/);
});
test("apply only deletes obsolete project SHA tags", () => {
  const r = run([current, rollback, "--apply"]);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.removed, `ghcr.io/aleks-man/kuda-krym-web:${old}`);
});
test("rejects absent rollback images before deleting anything", () => {
  const r = run([current, rollback, "--apply"], true);
  assert.notEqual(r.status, 0);
  assert.equal(r.removed, "");
});
test("rejects invalid or identical SHAs", () => {
  for (const args of [[current, current], ["latest", rollback], [current, rollback, "--force"]]) {
    const r = run(args);
    assert.equal(r.status, 2);
    assert.equal(r.removed, "");
  }
});
