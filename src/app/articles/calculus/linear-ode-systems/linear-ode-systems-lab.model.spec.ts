import { lab, calculateLab } from './linear-ode-systems-lab.model';
describe('linear-ode-systems laboratory mathematics', () => {
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
    it('conserves the radius only for the neutral linear flow', () => {
        const r = calculateLab(0, 6.3);
        for (const [x, y] of r.series[0].points)
            expect(x * x + y * y).toBeCloseTo(4, 12);
        expect(+calculateLab(-.2, 5).rows[0][1]).toBeCloseTo(2 / Math.E, 7);
        expect(calculateLab(.1, 5).rows[2][1]).toBe('Inestable');
    });
});
