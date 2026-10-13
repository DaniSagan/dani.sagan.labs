/** The site's ink, blue, coral and gold as a continuous escape-time palette. */
export function escapeColor(iteration: number, maximum: number): [number, number, number] {
  if (iteration >= maximum) return [10, 10, 15];
  const stops = [[15, 18, 35], [35, 62, 112], [74, 158, 255], [232, 100, 58], [212, 168, 67], [232, 228, 216]];
  const t = Math.min(.999999, Math.log1p(Math.max(0, iteration)) / Math.log1p(maximum)) * (stops.length - 1);
  const i = Math.floor(t), f = t - i;
  return stops[i].map((v, channel) => Math.round(v + f * (stops[i+1][channel] - v))) as [number, number, number];
}
