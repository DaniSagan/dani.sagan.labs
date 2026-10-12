import { lab, calculateLab } from './normal-distribution-lab.model';
describe('normal-distribution laboratory mathematics', () => {
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
    it('distinguishes a normal area from its density and includes tails outside the viewport', () => {
        const r = calculateLab(10, 60);
        expect(+r.rows[0][1]).toBe(1);
        expect(+r.rows[1][1]).toBeCloseTo(.841344746, 6);
        expect(+r.rows[2][1]).toBeCloseTo(.02419707245, 8);
        expect(+calculateLab(1, 50).rows[1][1]).toBeCloseTo(.5, 7);
    });
});
