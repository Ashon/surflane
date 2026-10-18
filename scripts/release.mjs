// Lockstep release helper: @surflane/design-tokens and @surflane/ui ship as one versioned pair.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const names = ["tokens", "ui"];
const manifestPath = (name) => resolve(root, "packages", name, "package.json");
const read = (name) => JSON.parse(readFileSync(manifestPath(name), "utf8"));
const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const usage = `Usage:
  node scripts/release.mjs version <x.y.z[-pre]>  set both package versions
  node scripts/release.mjs verify <vX.Y.Z>          check tag, manifests and changelog
  node scripts/release.mjs notes <vX.Y.Z>           print the changelog section
  node scripts/release.mjs publish [--dry-run] [--otp=<code>]
                                                    publish unpublished packages`;

function changelogSection(version) {
  const text = readFileSync(resolve(root, "CHANGELOG.md"), "utf8");
  const heading = new RegExp(
    `^## ${version.replaceAll(".", "\\.")}(?:\\s|$)`,
    "m",
  );
  const start = text.search(heading);
  if (start < 0) return undefined;
  const rest = text.slice(start).split("\n");
  const end = rest.findIndex((line, i) => i > 0 && line.startsWith("## "));
  return rest
    .slice(1, end < 0 ? undefined : end)
    .join("\n")
    .trim();
}

function verify(version) {
  const errors = [];
  const [tokens, ui] = names.map(read);
  for (const pkg of [tokens, ui])
    if (pkg.version !== version)
      errors.push(`${pkg.name} is ${pkg.version}, expected ${version}`);
  const peer = ui.peerDependencies?.[tokens.name];
  if (peer !== `^${version}`)
    errors.push(
      `${ui.name} peer ${tokens.name} is ${peer}, expected ^${version}`,
    );
  if (!changelogSection(version))
    errors.push(`CHANGELOG.md has no "## ${version}" section`);
  return errors;
}

const [command, arg, ...rest] = process.argv.slice(2);
if (command === "version") {
  if (!semver.test(arg ?? "")) throw new Error(usage);
  for (const name of names) {
    const pkg = read(name);
    pkg.version = arg;
    if (pkg.peerDependencies?.["@surflane/design-tokens"])
      pkg.peerDependencies["@surflane/design-tokens"] = `^${arg}`;
    writeFileSync(manifestPath(name), JSON.stringify(pkg, null, 2) + "\n");
  }
  execFileSync(
    "npm",
    [
      "install",
      "--package-lock-only",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
    ],
    { cwd: root, stdio: "inherit" },
  );
  const errors = verify(arg);
  console.log(`Set @surflane/design-tokens and @surflane/ui to ${arg}.`);
  if (errors.length) console.log(`Before tagging:\n- ${errors.join("\n- ")}`);
  console.log(
    `Then commit, tag v${arg} and push the tag to run the release workflow.`,
  );
} else if (command === "verify" || command === "notes") {
  const version = (arg ?? "").replace(/^v/, "");
  if (!semver.test(version)) throw new Error(usage);
  if (command === "notes") {
    const notes = changelogSection(version);
    if (!notes) throw new Error(`CHANGELOG.md has no "## ${version}" section`);
    console.log(notes);
  } else {
    const errors = verify(version);
    if (errors.length) {
      console.error(errors.join("\n"));
      process.exit(1);
    }
    console.log(`Release ${version} is consistent.`);
  }
} else if (command === "publish") {
  const flags = [arg, ...rest].filter(Boolean);
  // A manual publish from an account with 2FA passes its one-time code through to npm.
  if (
    flags.some((flag) => flag !== "--dry-run" && !/^--otp=\d{6,8}$/.test(flag))
  )
    throw new Error(usage);
  const dryRun = flags.includes("--dry-run");
  const otp = flags.filter((flag) => flag.startsWith("--otp="));
  // Tokens first: the UI package declares it as a peer dependency.
  for (const name of names) {
    const pkg = read(name);
    const published = spawnSync(
      "npm",
      ["view", `${pkg.name}@${pkg.version}`, "version"],
      { cwd: root, encoding: "utf8" },
    );
    if (published.status === 0 && published.stdout.trim() === pkg.version) {
      console.log(`${pkg.name}@${pkg.version} is already published; skipping.`);
      continue;
    }
    const tag = pkg.version.includes("-") ? "next" : "latest";
    execFileSync(
      "npm",
      [
        "publish",
        "--access",
        "public",
        "--tag",
        tag,
        ...(dryRun ? ["--dry-run"] : []),
        ...otp,
      ],
      { cwd: resolve(root, "packages", name), stdio: "inherit" },
    );
  }
} else {
  console.error(usage);
  process.exit(1);
}
