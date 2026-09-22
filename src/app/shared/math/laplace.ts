export interface ComplexValue {
  re: number;
  im: number;
}

/** Integral from 0 to T of exp(-(sigma-a+i omega)t). */
export function exponentialIntegral(
  a: number,
  sigma: number,
  omega: number,
  time: number,
): ComplexValue {
  const d = sigma - a;
  const norm = d * d + omega * omega;
  if (norm === 0) return { re: time, im: 0 };
  const angle = omega * time;
  const decay = Math.exp(-d * time);
  // This form avoids cancellation when d*T and omega*T are small.
  const re = -Math.expm1(-d * time) + decay * 2 * Math.sin(angle / 2) ** 2;
  const im = decay * Math.sin(angle);
  return { re: (re * d + im * omega) / norm, im: (im * d - re * omega) / norm };
}

/** Unit-step response of y''+2*zeta*w*y'+w²*y=w²*u, from rest. */
export function oscillatorStep(t: number, zeta: number, w: number): number {
  if (t <= 0) return 0;
  const x = w * t;
  if (Math.abs(zeta - 1) < 1e-8) return 1 - Math.exp(-x) * (1 + x);
  if (zeta < 1) {
    const b = Math.sqrt(1 - zeta * zeta);
    return (
      1 - Math.exp(-zeta * x) * (Math.cos(b * x) + (zeta / b) * Math.sin(b * x))
    );
  }
  const b = Math.sqrt(zeta * zeta - 1);
  const slow = -1 / (zeta + b);
  const fast = -(zeta + b);
  return 1 + (fast * Math.exp(slow * x) - slow * Math.exp(fast * x)) / (2 * b);
}

export function oscillatorPoles(zeta: number, w: number): ComplexValue[] {
  if (zeta <= 1) {
    const im = w * Math.sqrt(1 - zeta * zeta);
    return [
      { re: -zeta * w, im },
      { re: -zeta * w, im: -im },
    ];
  }
  const b = Math.sqrt(zeta * zeta - 1);
  return [
    { re: -w / (zeta + b), im: 0 },
    { re: -w * (zeta + b), im: 0 },
  ];
}

/** Response of y'+k*y=u(t-delay)-u(t-delay-width), with y(0)=0. */
export function pulseResponse(
  t: number,
  k: number,
  delay: number,
  width: number,
): number {
  if (t <= delay) return 0;
  const elapsed = Math.min(t - delay, width);
  return (
    (-Math.expm1(-k * elapsed) / k) *
    Math.exp(-k * Math.max(0, t - delay - width))
  );
}
