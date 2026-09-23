import { binomialMasses, moments, normalCdf, observation, seededRandom } from './central-limit';

describe('Central limit numerical models', () => {
  it('evaluates known normal probabilities and symmetry', () => {
    expect(normalCdf(0)).toBe(0.5);
    expect(normalCdf(1.9599639845)).toBeCloseTo(0.975, 6);
    expect(normalCdf(-3)).toBeCloseTo(1 - normalCdf(3), 12);
  });
  it('normalizes binomial masses even for skewed distributions', () => {
    for (const p of [0, 0.01, 0.3, 0.5, 0.99, 1]) {
      const masses = binomialMasses(200, p);
      expect(masses.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 11);
      expect(masses.reduce((a, b, k) => a + k * b, 0)).toBeCloseTo(200 * p, 9);
    }
    binomialMasses(4, 0.5).forEach((mass, k) => expect(mass).toBeCloseTo([1, 4, 6, 4, 1][k] / 16, 12));
  });
  it('replays identical random streams with values strictly inside (0,1)', () => {
    const a = seededRandom(2026), b = seededRandom(2026);
    for (let i = 0; i < 1000; i++) { const value = a(); expect(value).toBe(b()); expect(value).toBeGreaterThan(0); expect(value).toBeLessThan(1); }
  });
  it('reproduces the known population moments with a fixed simulation', () => {
    for (const kind of ['uniform', 'exponential', 'bernoulli', 'bimodal'] as const) {
      const random = seededRandom(12345), expected = moments(kind);
      let sum = 0, squares = 0;
      for (let i = 0; i < 50000; i++) { const x = observation(kind, random); sum += x; squares += x * x; }
      expect(Math.abs(sum / 50000 - expected.mean)).toBeLessThan(0.025);
      expect(Math.abs(squares / 50000 - (sum / 50000) ** 2 - expected.variance)).toBeLessThan(0.05);
    }
  });
});
