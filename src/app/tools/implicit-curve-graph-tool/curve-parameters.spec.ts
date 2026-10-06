import { detectCurveParameters } from './curve-parameters';
import { CURVE_EXAMPLES } from './curve-examples';
import { EXTRA_CONSTANTS, EXTRA_FUNCTIONS } from './math-catalog';

describe('Curve parameter detection', () => {
  const reserved = new Set(['x', 'y', ...Object.getOwnPropertyNames(Math),
    ...EXTRA_FUNCTIONS.map(entry => entry.name), ...EXTRA_CONSTANTS.map(entry => entry.name)]);

  it('reads whole letters and subscripted identifiers once in first appearance order', () => {
    expect(detectCurveParameters('a*x + b_10*y - r_t + a_1*a + Z + ñ + α + x_1', reserved))
      .toEqual(['a', 'b_10', 'r_t', 'a_1', 'Z', 'ñ', 'α', 'x_1']);
    expect(detectCurveParameters('radius*x + sin(y) + hypot(x,y) + PI + E + a_', reserved)).toEqual([]);
  });
  it('does not mistake scientific notation, literals, comments or properties for parameters', () => {
    expect(detectCurveParameters('1e-3*x + 2E+4*y + 0xff + .5e2 + Math.E + obj.a + a /* b */ + "c" + \'d\' // z', reserved))
      .toEqual(['a']);
  });
  it('keeps every existing gallery preset free of automatic parameters', () => {
    for (const example of CURVE_EXAMPLES) {
      expect(detectCurveParameters(example.formula, reserved)).withContext(example.id).toEqual([]);
    }
  });
});
