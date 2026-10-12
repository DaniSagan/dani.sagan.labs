import { lab, calculateLab } from './lines-planes-lab.model';
describe('lines-planes laboratory mathematics', () => {
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
    it('projects in three dimensions and draws a nonempty plane patch', () => {
        const r = calculateLab(3, 0);
        expect(r.rows[0][1]).toBe('-1, 0, 1');
        expect(+r.rows[1][1]).toBeCloseTo(2 * Math.sqrt(3), 6);
        expect(+r.rows[2][1]).toBeCloseTo(0, 12);
        expect(r.series[0].points.length).toBe(5);
    });
});
