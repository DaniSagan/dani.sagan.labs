/** Exact dyadic coordinates. Camera precision grows with zoom, with 96 guard bits. */
export interface MandelbrotView { real: bigint; imag: bigint; bits: number; zoom: number; }
export interface SavedView { real: string; imag: string; bits: number; zoom: number; }
export interface ExtendedComplex { r: number; i: number; e: number; }
export function fixedFromNumber(value: number, bits: number): bigint {
  if (!Number.isFinite(value)) throw new Error('Non-finite coordinate');
  if (!value) return 0n;
  const exponent = Math.floor(Math.log2(Math.abs(value)));
  const mantissa = BigInt(Math.round(Math.abs(value) * 2 ** (52 - exponent)));
  const shift = bits + exponent - 52;
  const integer = shift >= 0 ? mantissa << BigInt(shift) : mantissa >> BigInt(-shift);
  return value < 0 ? -integer : integer;
}
export function fixedFromDecimal(value: string, bits: number): bigint {
  const match = value.trim().match(/^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);
  if (!match || !(match[2] || match[3])) throw new Error('Invalid decimal coordinate');
  const digits = (match[2] || '') + (match[3] || '');
  const exponent = Number(match[4] || 0) - (match[3] || '').length;
  if (!Number.isSafeInteger(exponent)) throw new Error('Invalid decimal exponent');
  let integer = BigInt(digits) << BigInt(bits);
  integer = exponent >= 0 ? integer * 10n ** BigInt(exponent) : integer / 10n ** BigInt(-exponent);
  return match[1] === '-' ? -integer : integer;
}
export function normalize(r: number, i: number, e = 0): ExtendedComplex {
  const magnitude = Math.max(Math.abs(r), Math.abs(i));
  if (!magnitude) return { r: 0, i: 0, e: 0 };
  const shift = Math.floor(Math.log2(magnitude));
  return { r: r * 2 ** -shift, i: i * 2 ** -shift, e: e + shift };
}
export function extendedFromFixed(real: bigint, imag: bigint, bits: number): ExtendedComplex {
  const abs = (x: bigint) => x < 0n ? -x : x;
  const magnitude = abs(real) > abs(imag) ? abs(real) : abs(imag);
  if (!magnitude) return { r: 0, i: 0, e: 0 };
  const length = magnitude.toString(2).length;
  const rounded = (x: bigint): number => {
    const integer=abs(x);if(!integer)return 0;
    const componentLength=integer===magnitude?length:integer.toString(2).length;
    const shift=Math.max(0,componentLength-53);
    const top=shift?(integer+(1n<<BigInt(shift-1)))>>BigInt(shift):integer;
    const mantissa=Number(top)*2**(shift-componentLength);
    return mantissa*2**(componentLength-length)*(x<0n?-1:1);
  };
  return { r: rounded(real), i: rounded(imag), e: length - bits };
}
export function extendedAdd(a: ExtendedComplex, b: ExtendedComplex): ExtendedComplex {
  if (!a.r && !a.i) return b;
  if (!b.r && !b.i) return a;
  const e = Math.max(a.e, b.e);
  return normalize(a.r * 2 ** Math.max(-1074, a.e - e) + b.r * 2 ** Math.max(-1074, b.e - e),
    a.i * 2 ** Math.max(-1074, a.e - e) + b.i * 2 ** Math.max(-1074, b.e - e), e);
}
export function extendedMultiply(a: ExtendedComplex, b: ExtendedComplex): ExtendedComplex {
  return normalize(a.r * b.r - a.i * b.i, a.r * b.i + a.i * b.r, a.e + b.e);
}
export function extendedLog(a: ExtendedComplex): number { return a.r || a.i ? a.e + Math.log2(Math.hypot(a.r, a.i)) : -Infinity; }
export function extendedNumber(a: ExtendedComplex): [number, number] { return [a.r * 2 ** a.e, a.i * 2 ** a.e]; }
export function initialView(real = '-0.5', imag = '0', zoom = 0): MandelbrotView {
  const bits = Math.max(96, Math.ceil(zoom) + 96);
  return { real: fixedFromDecimal(real, bits), imag: fixedFromDecimal(imag, bits), bits, zoom };
}
export function saveView(view: MandelbrotView): SavedView { return { real: view.real.toString(), imag: view.imag.toString(), bits: view.bits, zoom: view.zoom }; }
export function restoreView(saved: SavedView): MandelbrotView {
  if (!Number.isSafeInteger(saved.bits) || saved.bits < 64 || !Number.isFinite(saved.zoom) || !/^-?\d+$/.test(saved.real) || !/^-?\d+$/.test(saved.imag)) throw new Error('Invalid saved view');
  const view = { real: BigInt(saved.real), imag: BigInt(saved.imag), bits: saved.bits, zoom: saved.zoom };
  return ensurePrecision(view);
}
export function ensurePrecision(view: MandelbrotView): MandelbrotView {
  const bits = Math.max(view.bits, Math.ceil(view.zoom) + 96);
  const shift = BigInt(bits - view.bits);
  return { ...view, real: view.real << shift, imag: view.imag << shift, bits };
}
export function spanFixed(view: MandelbrotView): bigint {
  const integerZoom = Math.floor(view.zoom);
  return fixedFromNumber(3.5 * 2 ** (integerZoom - view.zoom), view.bits - integerZoom);
}
/** Map screen positions with positive imaginary axis upwards. */
export function pointAt(view: MandelbrotView, x: number, y: number, width: number, height: number): [bigint, bigint] {
  const span = spanFixed(view);
  const fraction = (n: number) => (span * fixedFromNumber(n, 52)) >> 52n;
  return [view.real + fraction((x - width / 2) / width), view.imag + fraction((height / 2 - y) / width)];
}
/** Preserve the world point under the old cursor / pinch midpoint at its new position. */
export function transformView(view: MandelbrotView, fromX: number, fromY: number, toX: number, toY: number, width: number, height: number, zoomDelta: number): MandelbrotView {
  if (![fromX, fromY, toX, toY, width, height, zoomDelta].every(Number.isFinite) || width <= 0 || height <= 0) return view;
  const zoom = view.zoom + zoomDelta;
  if (!Number.isFinite(zoom)) return view;
  const precise = ensurePrecision({ ...view, zoom });
  const shift = BigInt(precise.bits - view.bits);
  const original = { ...view, bits: precise.bits, real: view.real << shift, imag: view.imag << shift };
  const [real, imag] = pointAt(original, fromX, fromY, width, height);
  const [offsetR, offsetI] = pointAt({ ...precise, real: 0n, imag: 0n }, toX, toY, width, height);
  return { ...precise, real: real - offsetR, imag: imag - offsetI };
}
export function decimalCoordinate(integer: bigint, bits: number, significant = 22): string {
  const negative = integer < 0n; if (negative) integer = -integer;
  const whole = integer >> BigInt(bits);
  const fraction = ((integer - (whole << BigInt(bits))) * 10n ** BigInt(significant)) >> BigInt(bits);
  return `${negative ? '-' : ''}${whole}.${fraction.toString().padStart(significant, '0')}`;
}
