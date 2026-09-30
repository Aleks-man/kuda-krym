import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
const current = "a".repeat(40), previous = "b".repeat(40);
const bash = process.platform === "win32" ? "C:/Program Files/Git/bin/bash.exe" : "bash";
function run({ fail = "", same = false, healthy = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "kuda-deploy-")).replaceAll("\\", "/");
  const path = join(dir, "deploy.sh");
  writeFileSync(path, readFileSync(resolve("infra/vps/deploy.sh"), "utf8").replace('APP_DIR="/opt/kuda-krym"', `APP_DIR="${dir}"`));
  writeFileSync(join(dir, ".env"), `IMAGE_TAG=${previous}\n`);
  writeFileSync(join(dir, ".rollback-image-tag"), previous + "\n");
  writeFileSync(join(dir, "mock.sh"), `
flock() { return 0; }
docker() {
  if [[ "$1" == inspect ]]; then
    if [[ "$3" == *Config.Image* ]]; then
      if [[ "$4" == kuda-krym-api-1 ]]; then echo ghcr.io/aleks-man/kuda-krym-api:${same ? current : previous};
      else echo ghcr.io/aleks-man/kuda-krym-web:${same ? current : previous}; fi
    else
      if [[ "${healthy}" == true || -f started ]]; then echo healthy; else echo unhealthy; fi
    fi
  elif [[ "$1 $2" == "compose up" ]]; then touch started;
  elif [[ "$1 $2 $3" == "compose run --rm" && "${fail}" == migration ]]; then return 1;
  fi
}
curl() { [[ "${fail}" != health ]]; }
bash() { printf '%s\\n' "$*" > cleanup-called; [[ "${fail}" != cleanup ]]; }
sleep() { :; }
`);
  try {
    const r = spawnSync(bash, [path, current], { cwd: dir, encoding: "utf8", env: { ...process.env, BASH_ENV: join(dir, "mock.sh") } });
    return { ...r, cleanup: existsSync(join(dir, "cleanup-called")) ? readFileSync(join(dir, "cleanup-called"), "utf8") : "" };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
test("successful deployment cleans up keeping actual prior release", () => {
  const r=run(); assert.equal(r.status,0,r.stderr); assert.match(r.cleanup,new RegExp(current+" "+previous+" --apply"));
});
test("failed migration or public health check never cleans images", () => {
  for(const fail of ["migration","health"]) { const r=run({fail}); assert.notEqual(r.status,0); assert.equal(r.cleanup,""); }
});
test("cleanup failure does not fail successful deployment", () => {
  const r=run({fail:"cleanup"}); assert.equal(r.status,0,r.stderr); assert.match(r.stderr,/WARNING/);
});
test("redeploy preserves saved rollback release", () => {
  const r=run({same:true}); assert.equal(r.status,0,r.stderr); assert.match(r.cleanup,new RegExp(current+" "+previous));
});
test("unhealthy previous deployment skips cleanup", () => {
  const r=run({healthy:false}); assert.equal(r.status,0,r.stderr); assert.equal(r.cleanup,"");
});
