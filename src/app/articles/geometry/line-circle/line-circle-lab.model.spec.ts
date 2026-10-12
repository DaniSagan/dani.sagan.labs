import { lab, calculateLab } from './line-circle-lab.model';
describe('line-circle laboratory mathematics', () => {
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
    it('classifies secants, tangency and exterior lines using distance', () => {
        expect(calculateLab(2, 1).rows[1][1]).toBe('Secante');
        expect(calculateLab(2, 2 * Math.SQRT2).rows[1][1]).toBe('Tangente');
        expect(calculateLab(2, 4).rows[1][1]).toBe('Exterior');
    });
});
