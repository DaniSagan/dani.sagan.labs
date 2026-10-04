export type Vector = [number, number, number];
export interface OrbitalElements {
  a: number;
  e: number;
  inclination: number;
  node: number;
  argument: number;
  meanAnomaly: number;
  period: number;
  epoch: number;
  poleRA?: number | null;
  poleDec?: number | null;
}
export const AU_KM = 149597870.7;
export const J2000 = 2451545;
const radians = Math.PI / 180;

/** Classical elements in an ecliptic or pole-defined reference plane, rendered with Y north. */
function orient(x: number, y: number, orbit: OrbitalElements): Vector {
  const w = orbit.argument * radians,
    n = orbit.node * radians,
    i = orbit.inclination * radians;
  const u = x * Math.cos(w) - y * Math.sin(w),
    v = x * Math.sin(w) + y * Math.cos(w);
  let a = u * Math.cos(n) - v * Math.cos(i) * Math.sin(n);
  let b = u * Math.sin(n) + v * Math.cos(i) * Math.cos(n);
  let c = v * Math.sin(i);
  if (orbit.poleRA != null && orbit.poleDec != null) {
    const ra = orbit.poleRA * radians,
      dec = orbit.poleDec * radians;
    // Basis of the equatorial reference plane defined by its ICRF pole.
    const px = Math.cos(dec) * Math.cos(ra),
      py = Math.cos(dec) * Math.sin(ra),
      pz = Math.sin(dec);
    const ax = -Math.sin(ra),
      ay = Math.cos(ra);
    const bx = -pz * ay,
      by = pz * ax,
      bz = px * ay - py * ax;
    const eqX = a * ax + b * bx + c * px,
      eqY = a * ay + b * by + c * py,
      eqZ = b * bz + c * pz;
    const tilt = 23.4392911 * radians;
    a = eqX;
    b = eqY * Math.cos(tilt) + eqZ * Math.sin(tilt);
    c = -eqY * Math.sin(tilt) + eqZ * Math.cos(tilt);
  }
  return [a, c, -b];
}
export function orbitalState(
  orbit: OrbitalElements,
  day = J2000,
): { position: Vector; velocity: Vector } {
  const m =
    (((orbit.meanAnomaly * radians +
      (2 * Math.PI * (day - orbit.epoch)) / orbit.period) %
      (2 * Math.PI)) +
      2 * Math.PI) %
    (2 * Math.PI);
  // Bracketed Newton iteration also converges for Sedna's high eccentricity.
  let low = 0,
    high = 2 * Math.PI,
    eccentric = orbit.e < 0.8 ? m : Math.PI;
  for (let j = 0; j < 40; j++) {
    const f = eccentric - orbit.e * Math.sin(eccentric) - m;
    if (Math.abs(f) < 1e-13) break;
    if (f > 0) high = eccentric;
    else low = eccentric;
    const next = eccentric - f / (1 - orbit.e * Math.cos(eccentric));
    eccentric = next > low && next < high ? next : (low + high) / 2;
  }
  const scale = Math.sqrt(1 - orbit.e ** 2),
    rate = (2 * Math.PI) / orbit.period / (1 - orbit.e * Math.cos(eccentric));
  return {
    position: orient(
      orbit.a * (Math.cos(eccentric) - orbit.e),
      orbit.a * scale * Math.sin(eccentric),
      orbit,
    ),
    velocity: orient(
      -orbit.a * Math.sin(eccentric) * rate,
      orbit.a * scale * Math.cos(eccentric) * rate,
      orbit,
    ),
  };
}
export function orbitalEllipse(
  orbit: OrbitalElements,
  segments = 192,
): Vector[] {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const e = (index / segments) * Math.PI * 2;
    return orient(
      orbit.a * (Math.cos(e) - orbit.e),
      orbit.a * Math.sqrt(1 - orbit.e ** 2) * Math.sin(e),
      orbit,
    );
  });
}
