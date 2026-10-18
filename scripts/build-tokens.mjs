import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import postcss from "postcss";
import {
  category,
  type,
  descriptions,
  categories,
} from "../packages/tokens/metadata.js";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = ["tokens.css", "foundation-tokens.css", "motion.css"];
const tokens = new Map();
const hash = createHash("sha256");
for (const file of files) {
  const css = readFileSync(resolve(root, "packages/tokens", file), "utf8");
  hash.update(file + "\0" + css);
  const ast = postcss.parse(css, { from: file });
  ast.walkDecls(/^--/, (decl) => {
    const name = decl.prop;
    let token = tokens.get(name);
    if (!token) {
      token = {
        name,
        category: category(name),
        type: type(name),
        description: descriptions[name] ?? "",
        variants: [],
        aliases: [],
      };
      tokens.set(name, token);
    }
    const ancestors = [];
    let parent = decl.parent;
    while (parent) {
      // Token blocks also target [data-theme] for scoped themes; the first selector names the context.
      if (parent.type === "rule")
        ancestors.unshift(parent.selector.split(",")[0].trim());
      else if (parent.type === "atrule")
        ancestors.unshift("@" + parent.name + " " + parent.params);
      parent = parent.parent;
    }
    token.variants.push({
      context: ancestors.join(" / "),
      value: decl.value,
      file,
      line: decl.source.start.line,
    });
    token.aliases = [
      ...new Set([
        ...token.aliases,
        ...[...decl.value.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]),
      ]),
    ];
  });
}
for (const token of tokens.values())
  for (const alias of token.aliases)
    if (!tokens.has(alias))
      throw new Error(`${token.name} references missing ${alias}`);
const catalog = {
  schemaVersion: 1,
  sourceHash: hash.digest("hex"),
  sources: files,
  categories,
  tokens: [...tokens.values()].sort((a, b) => a.name.localeCompare(b.name)),
};
writeFileSync(
  resolve(root, "packages/tokens/catalog.json"),
  JSON.stringify(catalog, null, 2) + "\n",
);
// Keep non-CSS theme consumers on the same palette and notation.
const chrome = tokens.get("--chrome");
const darkChrome = chrome?.variants.find(
  (variant) => variant.context === ":root",
)?.value;
const lightChrome = chrome?.variants.find(
  (variant) => variant.context === ':root[data-theme="light"]',
)?.value;
if (!darkChrome || !lightChrome)
  throw new Error("Both theme chrome values are required");
writeFileSync(
  resolve(root, "packages/tokens/theme.json"),
  JSON.stringify(
    { dark: { chrome: darkChrome }, light: { chrome: lightChrome } },
    null,
    2,
  ) + "\n",
);
console.log(`Generated ${tokens.size} tokens from ${files.length} CSS sources`);
