"use client";
import * as React from "react";
import { ScrollArea } from "./scroll-area.js";
import type { SyntaxToken } from "./syntax-engine.js";
export const syntaxLanguages = [
  "tsx",
  "jsx",
  "typescript",
  "javascript",
  "css",
  "html",
  "json",
  "bash",
  "yaml",
  "python",
  "sql",
  "markdown",
  "text",
] as const;
const aliases: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  py: "python",
  md: "markdown",
  xml: "html",
  plaintext: "text",
  txt: "text",
};
export type SyntaxHighlighterProps = Omit<
  React.ComponentPropsWithoutRef<"code">,
  "children"
> & {
  code: string;
  language?: string;
  inline?: boolean;
  label?: string;
  wrap?: boolean;
};
/** Rendering remains selectable React text; it never inserts executable HTML. */
export const SyntaxHighlighter = React.forwardRef<
  HTMLElement,
  SyntaxHighlighterProps
>(function SyntaxHighlighter(
  {
    code,
    language = "text",
    inline = false,
    label = "Highlighted source",
    wrap = false,
    className,
    ...props
  },
  ref,
) {
  const name = language.trim().toLowerCase();
  const lang = aliases[name] ?? name;
  const [result, setResult] = React.useState<{
    code: string;
    language: string;
    tokens: SyntaxToken[][] | null;
  }>();
  React.useEffect(() => {
    let current = true;
    if (
      lang === "text" ||
      !syntaxLanguages.includes(lang as (typeof syntaxLanguages)[number]) ||
      code.length > 50000
    )
      return;
    import("./syntax-engine.js")
      .then((engine) => engine.highlightCode(code, lang))
      .then((tokens) => {
        if (current) setResult({ code, language: lang, tokens });
      })
      .catch(() => {
        if (current) setResult({ code, language: lang, tokens: null });
      });
    return () => {
      current = false;
    };
  }, [code, lang]);
  const tokens =
    result?.code === code && result.language === lang ? result.tokens : null;
  const eols = code.match(/\r\n|\n|\r/g) ?? [];
  const valid = tokens && tokens.length === eols.length + 1;
  const element = (
    <code
      {...props}
      ref={ref}
      className={["pui-syntax", className].filter(Boolean).join(" ")}
      data-language={lang}
      data-highlighted={valid ? "true" : "false"}
    >
      {valid
        ? tokens.map((line, i) => (
            <React.Fragment key={i}>
              {line.map((token, j) => (
                <span key={j} data-syntax={token.role}>
                  {token.content}
                </span>
              ))}
              {eols[i] ?? ""}
            </React.Fragment>
          ))
        : code}
    </code>
  );
  return inline ? (
    element
  ) : (
    <ScrollArea label={label} orientation="horizontal">
      <pre className="pui-syntax-pre" data-wrap={wrap || undefined}>
        {element}
      </pre>
    </ScrollArea>
  );
});
