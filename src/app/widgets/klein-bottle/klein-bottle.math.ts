export interface KleinPoint { x: number; y: number; z: number; }
/** Classical immersion, using normalized longitudinal and transverse parameters. */
export function kleinPoint(u: number, v: number): KleinPoint {
  const a = u * 2 * Math.PI, b = v * 2 * Math.PI;
  const radius = 2 * (1 - Math.cos(a) / 2);
  return {
    x: (3 * Math.cos(a) * (1 + Math.sin(a)) + radius * (a < Math.PI ? Math.cos(a) * Math.cos(b) : Math.cos(b + Math.PI))) / 3,
    y: -radius * Math.sin(b) / 3,
    z: (-8 * Math.sin(a) - (a < Math.PI ? radius * Math.sin(a) * Math.cos(b) : 0)) / 3
  };
}
/** In the square quotient, a horizontal seam crossing flips the height. */
export function kleinTraveler(distance: number, height: number, twisted: boolean) {
  const crossings = Math.floor(distance);
  const flipped = twisted && crossings % 2 !== 0;
  return { u: distance - crossings, v: flipped ? 1 - height : height, flipped, crossings };
}
export function kleinPoint4D(u: number, v: number): number[] {
  return [(2 + Math.cos(v)) * Math.cos(u), (2 + Math.cos(v)) * Math.sin(u),
    Math.sin(v) * Math.cos(u / 2), Math.sin(v) * Math.sin(u / 2)];
}
