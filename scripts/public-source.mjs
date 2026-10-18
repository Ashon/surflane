import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, lstatSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const directories = new Set([
  "demo",
  "docs",
  "packages",
  "scripts",
  "tests",
  "examples",
  ".github",
]);
const rootFiles = new Set([
  "README.md",
  "package.json",
  "package-lock.json",
  ".gitignore",
  "playwright.config.ts",
  "playwright.catalog.config.ts",
  "playwright.browsers.config.ts",
  "LICENSE",
  "LICENSE-MIT",
  "LICENSE-APACHE",
  "NOTICE",
  "CHANGELOG.md",
]);
const excluded = new Set([
  ".git",
  "node_modules",
  "dist",
  "artifacts",
  "test-results",
  "playwright-report",
  ".next",
  ".astro",
  ".react-router",
]);
/** Works both in a checkout and in a standalone source archive. */
export function publicSourceFiles() {
  let files;
  if (existsSync(resolve(root, ".git"))) {
    files = execFileSync(
      "git",
      ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
      { cwd: root, encoding: "utf8" },
    ).split("\0");
  } else {
    files = [...rootFiles];
    const walk = (directory) => {
      if (!existsSync(resolve(root, directory))) return;
      for (const entry of readdirSync(resolve(root, directory), {
        withFileTypes: true,
      })) {
        if (excluded.has(entry.name) || entry.name.startsWith(".env")) continue;
        const file = `${directory}/${entry.name}`;
        if (entry.isDirectory()) walk(file);
        else files.push(file);
      }
    };
    for (const directory of directories) walk(directory);
  }
  return [...new Set(files)]
    .filter(
      (file) =>
        file &&
        existsSync(resolve(root, file)) &&
        !file
          .split("/")
          .some((part) => excluded.has(part) || part.startsWith(".env")) &&
        !lstatSync(resolve(root, file)).isSymbolicLink() &&
        (directories.has(file.split("/")[0]) || rootFiles.has(file)),
    )
    .sort();
}
