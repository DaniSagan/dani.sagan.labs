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
  it('provides defaults for exactly the detected parameters in every gallery family', () => {
    for (const example of CURVE_EXAMPLES) {
      const parameters = example.parameters ?? [];
      expect(detectCurveParameters(example.formula, reserved).sort()).withContext(example.id)
        .toEqual(parameters.map(p => p.name).sort());
      for (const p of parameters) {
        expect([p.min,p.max,p.step,p.value].every(Number.isFinite)).toBeTrue();
        expect(p.min).toBeLessThan(p.max);
        expect(p.value).toBeGreaterThanOrEqual(p.min);
        expect(p.value).toBeLessThanOrEqual(p.max);
        expect(p.step).toBeGreaterThan(0);
        if (p.integer) expect([p.min,p.max,p.value,p.step].every(Number.isInteger)).toBeTrue();
      }
    }
  });
});
