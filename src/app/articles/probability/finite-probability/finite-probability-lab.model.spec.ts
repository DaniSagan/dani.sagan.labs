import { lab, calculateLab } from './finite-probability-lab.model';
describe('finite-probability laboratory mathematics', () => {
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
    it('enumerates conditional dice probabilities and impossible sums', () => {
        const r = calculateLab(6, 8);
        expect(+r.rows[1][1]).toBeCloseTo(5 / 36, 7);
        expect(+r.rows[2][1]).toBeCloseTo(1 / 6, 7);
        expect(r.rows[3][1]).toBe('No');
        expect(+calculateLab(2, 24).rows[1][1]).toBe(0);
    });
});
