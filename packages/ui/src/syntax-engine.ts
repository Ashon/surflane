import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { HighlighterCore, LanguageInput } from "shiki/types";
export type SyntaxToken = { content: string; role: string };
const loaders: Record<string, () => Promise<{ default: LanguageInput }>> = {
  tsx: () => import("shiki/langs/tsx.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  bash: () => import("shiki/langs/bash.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
};
const roles = [
  "plain",
  "comment",
  "keyword",
  "string",
  "number",
  "function",
  "tag",
  "attribute",
  "punctuation",
];
const colors = Object.fromEntries(
  roles.map((role, i) => [`#00000${i + 1}`, role]),
);
const color = (index: number) => `#00000${index + 1}`;
let engine: Promise<HighlighterCore> | undefined;
const languages = new Map<string, Promise<void>>();
function highlighter() {
  return (engine ??= createHighlighterCore({
    engine: createJavaScriptRegexEngine({ forgiving: true }),
    langs: [],
    themes: [
      {
        name: "platform-quiet",
        type: "dark",
        colors: {
          "editor.foreground": color(0),
          "editor.background": "#000000",
        },
        tokenColors: [
          {
            scope: ["comment", "punctuation.definition.comment"],
            settings: { foreground: color(1) },
          },
          {
            scope: ["keyword", "storage", "constant.language"],
            settings: { foreground: color(2) },
          },
          {
            scope: ["string", "markup.inline.raw", "markup.fenced_code.block"],
            settings: { foreground: color(3) },
          },
          {
            scope: ["constant.numeric", "constant.character"],
            settings: { foreground: color(4) },
          },
          {
            scope: [
              "entity.name.function",
              "support.function",
              "entity.name.type",
              "support.type",
              "entity.name.class",
            ],
            settings: { foreground: color(5) },
          },
          {
            scope: ["entity.name.tag", "markup.heading"],
            settings: { foreground: color(6) },
          },
          {
            scope: [
              "entity.other.attribute-name",
              "support.type.property-name",
              "variable.other.property",
            ],
            settings: { foreground: color(7) },
          },
          {
            scope: ["punctuation", "meta.brace"],
            settings: { foreground: color(8) },
          },
        ],
      },
    ],
  }).catch((error) => {
    engine = undefined;
    throw error;
  }));
}
/** Engine and grammars are singletons. Result cache is bounded by count and source length. */
const cache = new Map<string, SyntaxToken[][]>();
export async function highlightCode(
  code: string,
  language: string,
): Promise<SyntaxToken[][] | null> {
  const loader = loaders[language];
  if (!loader || code.length > 50000) return null;
  const key = `${language}\0${code}`;
  if (cache.has(key)) {
    const value = cache.get(key)!;
    cache.delete(key);
    cache.set(key, value);
    return value;
  }
  const instance = await highlighter();
  if (!languages.has(language))
    languages.set(
      language,
      loader()
        .then((module) => instance.loadLanguage(module.default))
        .catch((error) => {
          languages.delete(language);
          throw error;
        }),
    );
  await languages.get(language);
  const tokens = instance
    .codeToTokensBase(code, { lang: language, theme: "platform-quiet" })
    .map((line) =>
      line.map((token) => ({
        content: token.content,
        role: colors[token.color?.toLowerCase() ?? ""] ?? "plain",
      })),
    );
  if (code.length <= 8000) {
    cache.set(key, tokens);
    if (cache.size > 24) cache.delete(cache.keys().next().value!);
  }
  return tokens;
}
