import React, { useCallback, useEffect, useRef } from "react";
type Draw = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  dpr: number,
  host: HTMLElement,
) => void;
/** Share device-pixel alignment between static diagrams and the pointer paint layer. */
export function prepareBlueprintCanvas(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
) {
  const dpr = window.devicePixelRatio || 1;
  canvas.style.transform = "none";
  canvas.style.transformOrigin = "0 0";
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.right = "auto";
  canvas.style.bottom = "auto";
  canvas.style.inlineSize = `${cssWidth}px`;
  canvas.style.blockSize = `${cssHeight}px`;
  const base = canvas.getBoundingClientRect();
  const dx = Math.round(base.left * dpr) / dpr - base.left;
  const dy = Math.round(base.top * dpr) / dpr - base.top;
  const scaleX = base.width
    ? Math.round(base.width * dpr) / dpr / base.width
    : 1;
  const scaleY = base.height
    ? Math.round(base.height * dpr) / dpr / base.height
    : 1;
  canvas.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * dpr));
  const height = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, width, height);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.strokeStyle = getComputedStyle(canvas).color;
  context.lineWidth = 1 / dpr;
  context.lineCap = "butt";
  return { context, width: width / dpr, height: height / dpr, dpr };
}
/** One device-pixel strokes; this canvas is a paint layer, never a layout item. */
export function BlueprintCanvas({
  hostRef,
  draw,
  className = "",
}: {
  hostRef: React.RefObject<HTMLElement | null>;
  draw: Draw;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current,
      host = hostRef.current;
    if (!canvas || !host) return;
    let frame = 0;
    let stopped = false;
    let resolution: MediaQueryList | undefined;
    const paint = () => {
      if (stopped) return;
      const hostRect = host.getBoundingClientRect();
      const prepared = prepareBlueprintCanvas(
        canvas,
        hostRect.width,
        hostRect.height,
      );
      if (!prepared) return;
      const { context, width, height, dpr } = prepared;
      draw(context, width, height, dpr, host);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    const watchResolution = () => {
      resolution?.removeEventListener("change", changedResolution);
      resolution = matchMedia(
        `(resolution: ${window.devicePixelRatio || 1}dppx)`,
      );
      resolution.addEventListener("change", changedResolution);
    };
    function changedResolution() {
      watchResolution();
      schedule();
    }
    const resize = new ResizeObserver(schedule);
    resize.observe(host);
    const theme = new MutationObserver(schedule);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    const forcedColors = matchMedia("(forced-colors: active)");
    forcedColors.addEventListener("change", schedule);
    window.addEventListener("resize", schedule);
    document.addEventListener("transitionend", schedule);
    watchResolution();
    schedule();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      resolution?.removeEventListener("change", changedResolution);
      forcedColors.removeEventListener("change", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("transitionend", schedule);
    };
  }, [draw, hostRef]);
  return (
    <canvas
      ref={canvasRef}
      className={`blueprint-canvas ${className}`}
      aria-hidden="true"
    />
  );
}
export function GridBlueprint({
  hostRef,
  visible = true,
}: {
  hostRef: React.RefObject<HTMLElement | null>;
  visible?: boolean;
}) {
  const draw = useCallback<Draw>((context, width, height, dpr, host) => {
    const style = getComputedStyle(host);
    const columns =
      Number(style.getPropertyValue("--preview-guide-columns")) || 12;
    const gutter =
      parseFloat(style.getPropertyValue("--preview-guide-gap")) || 0;
    const pitch = (width + gutter) / columns;
    const snap = (value: number) =>
      Math.max(
        0.5 / dpr,
        Math.min(width - 0.5 / dpr, (Math.floor(value * dpr) + 0.5) / dpr),
      );
    // Rasterize whole device-pixel columns. A scaled 1/dpr stroke can
    // receive fractional Skia coverage at DPR 3 despite snapped centers.
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = context.strokeStyle;
    for (let i = 0; i < columns; i++)
      for (const value of [i * pitch, (i + 1) * pitch - gutter]) {
        context.fillRect(
          Math.floor(snap(value) * dpr),
          0,
          1,
          Math.round(height * dpr),
        );
      }
    context.restore();
  }, []);
  return visible ? (
    <BlueprintCanvas hostRef={hostRef} draw={draw} className="grid-blueprint" />
  ) : null;
}

export function SpacingScaleMark({ step }: { step: number }) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const draw = useCallback<Draw>((context, width, height, dpr) => {
    const y = (Math.floor((height * dpr) / 2) + 0.5) / dpr;
    const left = 0.5 / dpr,
      right = width - 0.5 / dpr;
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(right, y);
    for (const x of [left, right]) {
      context.moveTo(x, 0);
      context.lineTo(x, height);
    }
    context.stroke();
  }, []);
  return (
    <span
      ref={hostRef}
      className="spacing-scale-mark"
      style={{ inlineSize: `var(--space-${step})` }}
      aria-hidden="true"
    >
      <BlueprintCanvas
        hostRef={hostRef}
        draw={draw}
        className="spacing-blueprint"
      />
    </span>
  );
}
