"use client";
import * as React from "react";
import { Surface } from "./foundations.js";
import { part } from "./parts.js";
import { Button } from "./button.js";
import { SyntaxHighlighter } from "./syntax-highlighter.js";
import { ScrollArea } from "./scroll-area.js";
const CardRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Surface>
>(function CardRoot({ className, padding, ...props }, ref) {
  return (
    <Surface
      {...props}
      padding={padding}
      ref={ref}
      className={["pui-card", className].filter(Boolean).join(" ")}
    />
  );
});
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h3"> & { level?: 2 | 3 | 4 | 5 | 6 }
>(function CardTitle({ level = 3, className, ...props }, ref) {
  return React.createElement(`h${level}`, {
    ...props,
    ref,
    className: ["pui-card-title", className].filter(Boolean).join(" "),
  });
});
export const Card = {
  Root: CardRoot,
  Header: part<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    "div",
    "pui-card-header",
  ),
  Title: CardTitle,
  Description: part<HTMLParagraphElement, React.ComponentPropsWithoutRef<"p">>(
    "p",
    "pui-card-description",
  ),
  Body: part<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    "div",
    "pui-card-body",
  ),
  Footer: part<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
    "div",
    "pui-card-footer",
  ),
};
export type CodeBlockProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "children" | "onCopy"
> & {
  code: string;
  label?: string;
  language?: string;
  wrap?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  copyErrorLabel?: string;
  onCopy?: (code: string) => void | Promise<void>;
};
export const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  function CodeBlock(
    {
      code,
      label = "Code",
      language,
      wrap = false,
      copyLabel = "Copy code",
      copiedLabel = "Code copied.",
      copyErrorLabel = "Copy unavailable. Select the code and copy it manually.",
      onCopy,
      className,
      ...props
    },
    ref,
  ) {
    const [result, setResult] = React.useState(""),
      [busy, setBusy] = React.useState(false);
    const revision = React.useRef(0),
      mounted = React.useRef(false);
    React.useEffect(() => {
      mounted.current = true;
      return () => {
        mounted.current = false;
        revision.current++;
      };
    }, []);
    React.useEffect(() => {
      revision.current++;
      setResult("");
      setBusy(false);
    }, [code]);
    async function copy() {
      const request = ++revision.current;
      setBusy(true);
      setResult("");
      let outcome: string;
      try {
        if (onCopy) await onCopy(code);
        else await navigator.clipboard.writeText(code);
        outcome = copiedLabel;
      } catch {
        outcome = copyErrorLabel;
      }
      if (mounted.current && request === revision.current) {
        setResult(outcome);
        setBusy(false);
      }
    }
    return (
      <div
        {...props}
        ref={ref}
        data-wrap={wrap || undefined}
        className={["pui-code-block", className].filter(Boolean).join(" ")}
      >
        <div className="pui-code-toolbar">
          <span className="pui-code-label">
            {label}
            {language && <span className="pui-code-language">{language}</span>}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copy}
            disabled={busy}
            aria-busy={busy || undefined}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V4H4v12h4" />
            </svg>
            {copyLabel}
          </Button>
        </div>
        <ScrollArea label={label} orientation="horizontal">
          <pre className="pui-code-text">
            <SyntaxHighlighter code={code} language={language} inline />
          </pre>
        </ScrollArea>
        <span className="pui-code-result" role="status">
          {result}
        </span>
      </div>
    );
  },
);

// Flat names for React Server Components, which cannot dot into client exports.
export { CardRoot, CardTitle };
export const {
  Header: CardHeader,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
} = Card;
