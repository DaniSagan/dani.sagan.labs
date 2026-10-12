import { lab, calculateLab } from './first-integrals-lab.model';
describe('first-integrals laboratory mathematics', () => {
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
    it('exhibits the predicted explicit Euler drift and bounded symplectic energy', () => {
        const r = calculateLab(.1, 1), explicit = r.series[0].points, symplectic = r.series[1].points;
        expect(explicit[100][1]).toBeCloseTo(.5 * 1.01 ** 100, 10);
        expect(Math.max(...symplectic.map(p => p[1]))).toBeLessThan(.56);
        expect(Math.min(...symplectic.map(p => p[1]))).toBeGreaterThan(.44);
    });
});
