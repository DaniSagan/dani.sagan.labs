export interface StripPoint {
  x: number;
  y: number;
  z: number;
}
export function stripPoint(u: number, v: number, twisted = true): StripPoint {
  const twist = twisted ? u / 2 : 0;
  return {
    x: (2 + v * Math.cos(twist)) * Math.cos(u),
    y: (2 + v * Math.cos(twist)) * Math.sin(u),
    z: v * Math.sin(twist),
  };
}
/** A continuous choice along the lifted centerline; it flips after one Möbius lap. */
export function stripNormal(u: number, twisted = true): StripPoint {
  const twist = twisted ? u / 2 : 0;
  return {
    x: Math.sin(twist) * Math.cos(u),
    y: Math.sin(twist) * Math.sin(u),
    z: -Math.cos(twist),
  };
}
export function seamPartner(v: number, twisted: boolean): number {
  return twisted ? -v : v;
}
