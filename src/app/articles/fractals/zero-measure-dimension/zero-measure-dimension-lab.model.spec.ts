import { lab, calculateLab } from './zero-measure-dimension-lab.model';
describe('zero-measure-dimension laboratory mathematics', () => {
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
    it('distinguishes finite Cantor length from the dimension of its limit', () => {
        const r = calculateLab(4, 1 / 3);
        expect(r.intervals!.length).toBe(16);
        expect(r.intervals!.reduce((s, [a, b]) => s + b - a, 0)).toBeCloseTo(16 / 81, 12);
        expect(+r.rows[2][1]).toBeCloseTo(Math.log(2) / Math.log(3), 7);
        expect(+calculateLab(4, .25).rows[2][1]).toBe(.5);
    });
});
