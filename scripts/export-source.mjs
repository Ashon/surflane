import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { publicSourceFiles, root } from "./public-source.mjs";
execFileSync(process.execPath, [resolve(root, "scripts/check-public.mjs")], {
  cwd: root,
  stdio: "inherit",
});
const artifacts = resolve(root, "artifacts");
mkdirSync(artifacts, { recursive: true });
const staging = mkdtempSync(resolve(artifacts, ".source-"));
const output = resolve(artifacts, "surflane-source");
try {
  for (const file of publicSourceFiles()) {
    const destination = resolve(staging, file);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(resolve(root, file), destination);
  }
  // Only replace the directory owned by this exporter.
  rmSync(output, { recursive: true, force: true });
  renameSync(staging, output);
  execFileSync("tar", [
    "-czf",
    resolve(artifacts, "surflane-source.tar.gz"),
    "-C",
    artifacts,
    "surflane-source",
  ]);
  console.log(
    "Source export: artifacts/surflane-source/ and artifacts/surflane-source.tar.gz",
  );
} finally {
  rmSync(staging, { recursive: true, force: true });
}
