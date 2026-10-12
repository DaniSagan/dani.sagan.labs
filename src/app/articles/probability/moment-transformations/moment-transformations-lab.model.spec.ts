import { lab, calculateLab } from './moment-transformations-lab.model';
describe('moment-transformations laboratory mathematics', () => {
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
    it('uses squared scales for variance and absolute scales for standard deviation', () => {
        const r = calculateLab(-2, 7);
        expect(+r.rows[0][1]).toBe(-1);
        expect(+r.rows[1][1]).toBe(8);
        expect(+r.rows[2][1]).toBeCloseTo(Math.sqrt(8), 6);
        expect(+calculateLab(0, 7).rows[1][1]).toBe(0);
    });
});
