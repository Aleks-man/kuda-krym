import { spawn } from "node:child_process";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("Run the development environment through `npm run dev`");
}

const workspaces = [
  "@kuda-krym/contracts",
  "@kuda-krym/web",
  "@kuda-krym/api",
];
const children = workspaces.map((workspace) =>
  spawn(process.execPath, [npmCli, "run", "dev", "--workspace", workspace], {
    env: process.env,
    stdio: "inherit",
  }),
);

let stopping = false;

function stopChildren(signal) {
  if (stopping) return;
  stopping = true;

  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill(signal);
    }
  }
}

for (const child of children) {
  child.once("error", (error) => {
    console.error("Unable to start a development process", error);
    process.exitCode = 1;
    stopChildren("SIGTERM");
  });

  child.once("exit", (code, signal) => {
    if (stopping) return;

    if (code !== 0) {
      console.error(
        `A development process stopped unexpectedly (${signal ?? `exit ${code}`})`,
      );
    }

    process.exitCode = code ?? 1;
    stopChildren("SIGTERM");
  });
}

process.once("SIGINT", () => {
  process.exitCode = 130;
  stopChildren("SIGINT");
});

process.once("SIGTERM", () => {
  process.exitCode = 143;
  stopChildren("SIGTERM");
});
