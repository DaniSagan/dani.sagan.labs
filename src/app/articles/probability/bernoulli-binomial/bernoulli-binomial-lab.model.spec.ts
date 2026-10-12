import { lab, calculateLab } from './bernoulli-binomial-lab.model';
describe('bernoulli-binomial laboratory mathematics', () => {
    it('keeps every default and boundary plot finite and its window nondegenerate', () => {
        {
            const config = lab;
            for (const a of [config.controls[0].min, config.controls[0].value, config.controls[0].max]) {
                for (const b of [config.controls[1].min, config.controls[1].value, config.controls[1].max]) {
                    const r = calculateLab(a, b), [xmin, xmax, ymin, ymax] = r.bounds;
                    expect(xmax).toBeGreaterThan(xmin);
                    expect(ymax).toBeGreaterThan(ymin);
                    expect(r.series.flatMap(s => s.points).flat().every(Number.isFinite)).toBeTrue();
                    expect(r.rows.length).toBeGreaterThan(1);
                }
            }
        }
    });
    it('normalizes binomial probabilities, including degenerate endpoints', () => {
        for (const p of [0, .25, .5, 1]) {
            const points = calculateLab(5, p).series[0].points;
            expect(points.reduce((s, [k, v]) => s + v, 0)).toBeCloseTo(1, 12);
            expect(points.reduce((s, [k, v]) => s + k * v, 0)).toBeCloseTo(5 * p, 12);
            expect(points.reduce((s, [k, v]) => s + (k - 5 * p) ** 2 * v, 0)).toBeCloseTo(5 * p * (1 - p), 12);
        }
        expect(calculateLab(5, .5).series[0].points[3][1]).toBeCloseTo(5 / 16, 12);
    });
});
