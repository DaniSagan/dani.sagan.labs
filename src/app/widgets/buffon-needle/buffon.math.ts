export function needleCrosses(distance: number, ratio: number, perpendicular: number): boolean {
  return distance <= ratio * Math.abs(perpendicular) / 2 + 8 * Number.EPSILON;
}
export function sampleNeedle(ratio: number, random: () => number = Math.random) {
  if (!Number.isFinite(ratio) || ratio <= 0 || ratio > 1) { throw new RangeError('La razón ℓ/d debe estar entre 0 y 1.'); }
  let dx = 0, dy = 0, squared = 0;
  do { dx = 2 * random() - 1; dy = 2 * random() - 1; squared = dx * dx + dy * dy; } while (squared === 0 || squared > 1);
  const length = Math.sqrt(squared); dx /= length; dy /= length;
  const y = 1 + 4 * random();
  const distance = Math.abs(y - Math.round(y));
  const x = 0.6 + 7.8 * random();
  return { x, y, dx, dy, crosses: needleCrosses(distance, ratio, dy) };
}
export function estimatePi(ratio: number, count: number, crosses: number): number | null {
  return count > 0 && crosses > 0 ? 2 * ratio * count / crosses : null;
}
