/** Canonical millimetres, independent of the document's display unit. */
export const CENTIMETRE_GRID = 10;
export const CENTIMETRE_MIN_PIXELS = 5;

export function gridResolution(base: number, pixelsPerMillimetre: number, visible: boolean): { fine: boolean; step: number } {
  const fine = visible && base > CENTIMETRE_GRID && pixelsPerMillimetre * CENTIMETRE_GRID >= CENTIMETRE_MIN_PIXELS;
  return { fine, step: fine ? CENTIMETRE_GRID : base };
}
