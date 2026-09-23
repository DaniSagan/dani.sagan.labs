import {
  mixedWedges,
  monochromaticTriangles,
  pentagonMask,
  ramseyEdges,
  ramseyTriples,
  ramseyWitness,
  resizeRamseyMask,
} from './ramsey';

describe('Ramsey R(3,3) model', () => {
  it('constructs complete labelled graphs and the triangle-free pentagon', () => {
    expect(ramseyEdges(5).length).toBe(10);
    expect(ramseyEdges(6).length).toBe(15);
    expect(ramseyTriples(6).length).toBe(20);
    expect(monochromaticTriangles(5, pentagonMask(5)).length).toBe(0);
    expect(monochromaticTriangles(5, pentagonMask(5) ^ 1023).length).toBe(0);
    expect(monochromaticTriangles(6, 32767).length).toBe(20);
  });
  it('preserves every existing edge when inserting or removing the sixth vertex', () => {
    for (let mask = 0; mask < 1024; mask++) {
      expect(resizeRamseyMask(6, 5, resizeRamseyMask(5, 6, mask))).toBe(mask);
    }
  });
  it('verifies both bounds and the double-counting identity over every coloring', () => {
    for (const n of [5, 6]) {
      const triples = ramseyTriples(n),
        total = 2 ** ramseyEdges(n).length;
      let zero = 0,
        minimum = 20,
        sum = 0,
        identityHolds = true;
      for (let mask = 0; mask < total; mask++) {
        const count = triples.filter(
          (t) => (mask & t.bits) === 0 || (mask & t.bits) === t.bits,
        ).length;
        if (!count) zero++;
        minimum = Math.min(minimum, count);
        sum += count;
        if (
          count !==
          triples.length - mixedWedges(n, mask).reduce((a, b) => a + b, 0) / 2
        )
          identityHolds = false;
      }
      expect(zero).toBe(n === 5 ? 12 : 0);
      expect(minimum).toBe(n === 5 ? 0 : 2);
      expect(sum / total).toBe(triples.length / 4);
      expect(identityHolds).toBeTrue();
    }
  });
  it('constructs a genuine witness in all 32768 colorings', () => {
    let valid = true;
    for (let mask = 0; mask < 32768; mask++) {
      const proof = ramseyWitness(mask, 0);
      const bits = proof.triangle.edges.map((e) => !!(mask & (1 << e)));
      if (
        new Set(proof.triangle.vertices).size !== 3 ||
        !bits.every((b) => b === proof.triangle.red)
      )
        valid = false;
    }
    expect(valid).toBeTrue();
    for (const mask of [0, 715, 12345, 32767])
      for (let pivot = 0; pivot < 6; pivot++) {
        const proof = ramseyWitness(mask, pivot);
        expect(proof.chosen.includes(pivot)).toBeFalse();
        expect(proof.chosen.length).toBe(3);
        expect(
          proof.spokes.every((i) => !!(mask & (1 << i)) === proof.red),
        ).toBeTrue();
      }
  });
});
