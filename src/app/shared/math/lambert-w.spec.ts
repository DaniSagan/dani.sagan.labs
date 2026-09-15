import { lambertW, decayRoots, LAMBERT_BRANCH_POINT } from './lambert-w';
describe('Lambert W', () => {
  it('evaluates reference values, branch endpoints and small arguments', () => {
    expect(lambertW(0)).toBe(0); expect(lambertW(Math.E)).toBeCloseTo(1, 12);
    expect(lambertW(1)).toBeCloseTo(0.5671432904097838, 12);
    expect(lambertW(LAMBERT_BRANCH_POINT)).toBe(-1);
    expect(lambertW(LAMBERT_BRANCH_POINT, -1)).toBe(-1);
    expect(lambertW(-0.2, -1)).toBeCloseTo(-2.5426413577735265, 11);
    expect(lambertW(1e-100)).toBe(1e-100);
  });
  it('satisfies the defining equation and keeps branches separate', () => {
    for (const z of [-0.36, -0.2, -0.01, -1e-100]) {
      for (const branch of [0, -1] as const) {
        const w = lambertW(z, branch);
        expect((w * Math.exp(w)) / z).toBeCloseTo(1, 10);
        expect(branch === 0 ? w >= -1 : w <= -1).toBeTrue();
      }
    }
    const w = lambertW(1e300);
    expect(w + Math.log(w)).toBeCloseTo(Math.log(1e300), 10);
    expect(() => lambertW(-0.4)).toThrow(); expect(() => lambertW(0, -1)).toThrow();
    expect(() => lambertW(Infinity)).toThrow();
  });
  it('returns all real decay roots without duplicating the turning point', () => {
    expect(decayRoots(0.2).length).toBe(2);
    decayRoots(0.2).forEach(x => expect(x * Math.exp(-x)).toBeCloseTo(0.2, 12));
    expect(decayRoots(1 / Math.E)).toEqual([1]); expect(decayRoots(0.5)).toEqual([]);
    expect(decayRoots(0)[0]).toBeCloseTo(0, 12); expect(decayRoots(-0.1)[0]).toBeLessThan(0);
  });
});
