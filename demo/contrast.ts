/** WCAG relative luminance for encoded sRGB channels in the 0–255 range. */
export function contrastRatio(a: readonly number[], b: readonly number[]) {
  const luminance = (rgb: readonly number[]) => {
    const linear = rgb.slice(0, 3).map((v) => {
      const channel = v / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
