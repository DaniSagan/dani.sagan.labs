import { EXPLORER_CONFIGS, explorerResult, choose, proportionIntervals, binomialCdf, studentDensity, chiDensity, sudokuSolutions, cantorValue } from './deep-explorer-model';
describe('Deep article laboratories', () => {
    for (const [topic, c] of Object.entries(EXPLORER_CONFIGS)) {
        it(topic + ' remains defined at default values and control limits', () => {
            const [a, b] = c.controls;
            for (const control of c.controls) {
                expect(control.value).toBeGreaterThanOrEqual(control.min);
                expect(control.value).toBeLessThanOrEqual(control.max);
                const steps = (control.value - control.min) / control.step;
                expect(steps).toBeCloseTo(Math.round(steps), 8);
            }
            for (const [x, y] of [[a.value, b.value], [a.min, b.value], [a.max, b.value], [a.value, b.min], [a.value, b.max], [a.min, b.min], [a.max, b.max]]) {
                const r = explorerResult(topic, x, y);
                expect([r.xmin, r.xmax, r.ymin, r.ymax].every(Number.isFinite)).toBeTrue();
                expect(r.xmax).toBeGreaterThan(r.xmin);
                expect(r.ymax).toBeGreaterThan(r.ymin);
                expect(r.rows.length).toBeGreaterThan(0);
                for (const s of r.series)
                    for (const p of s.points)
                        expect(p.every(Number.isFinite)).toBeTrue();
                expect(r.rows.some(row => row[1].includes('NaN') || row[1].includes('Infinity') || row[1] === 'no definido')).toBeFalse();
            }
        });
    }
    const value = (topic: string, a: number, b: number, label: string) => Number(explorerResult(topic, a, b).rows.find(r => r[0] === label)![1]);
    it('counts the tangent triangle once despite arcsine rounding', () => {
        expect(value('sine-law', 30, 2, 'Triángulos posibles')).toBe(0);
        expect(value('sine-law', 30, 3, 'Triángulos posibles')).toBe(1);
        expect(value('sine-law', 30, 4, 'Triángulos posibles')).toBe(2);
        expect(value('sine-law', 30, 6, 'Triángulos posibles')).toBe(1);
    });
    it('counts binomial coefficients without overflowing intermediate factorials', () => { expect(choose(200, 100)).toBeCloseTo(9.054851465610328e58, -45); expect(binomialCdf(99, 200, .5)).toBeCloseTo(.4718257604953717, 10); });
    it('inverts the exact binomial tails and handles boundary observations', () => { const zero = proportionIntervals(0, 20), all = proportionIntervals(20, 20), middle = proportionIntervals(7, 20); expect(zero.exact[0]).toBe(0); expect(zero.exact[1]).toBeCloseTo(1 - .025 ** (1 / 20), 10); expect(all.exact[1]).toBe(1); expect(binomialCdf(6, 20, middle.exact[0])).toBeCloseTo(.975, 10); expect(binomialCdf(7, 20, middle.exact[1])).toBeCloseTo(.025, 10); expect(middle.wilson[0]).toBeGreaterThan(0); expect(middle.wilson[1]).toBeLessThan(1); });
    it('has Cauchy and exponential density special cases', () => { expect(studentDensity(2, 1)).toBeCloseTo(1 / (5 * Math.PI), 12); expect(chiDensity(2, 2)).toBeCloseTo(Math.exp(-1) / 2, 12); });
    it('enumerates every legal four by four sudoku exactly once', () => { const s = sudokuSolutions(); expect(s.length).toBe(288); expect(new Set(s.map(x => x.join(''))).size).toBe(288); for (const board of s)
        for (let r = 0; r < 4; r++) {
            expect(new Set(board.slice(4 * r, 4 * r + 4)).size).toBe(4);
            expect(new Set([0, 1, 2, 3].map(j => board[4 * j + r])).size).toBe(4);
        } expect(value('sudoku-constraints', 0, 0, 'Soluciones compatibles')).toBe(288); expect(value('sudoku-constraints', 16, 0, 'Soluciones compatibles')).toBe(1); });
    it('agrees with explicitly enumerated binary necklaces', () => { for (let n = 3; n <= 7; n++) {
        const reps = new Set<string>();
        for (let mask = 0; mask < 2 ** n; mask++) {
            const x = mask.toString(2).padStart(n, '0'), rot = Array.from({ length: n }, (_, k) => x.slice(k) + x.slice(0, k));
            reps.add(rot.sort()[0]);
        }
        expect(value('burnside-lemma', n, 2, 'Órbitas rotacionales')).toBe(reps.size);
    } });
    it('improves integration errors at their respective orders', () => { for (const [method, factor] of [['Euler', 2], ['Heun', 4], ['RK4', 16]] as const) {
        const coarse = value('ode-numerical-integration', .1, 2, 'Error final ' + method), fine = value('ode-numerical-integration', .05, 2, 'Error final ' + method);
        expect(coarse / fine).toBeGreaterThan(factor * .9);
        expect(coarse / fine).toBeLessThan(factor * 1.2);
    } });
    it('preserves Cantor plateaus, endpoints and monotonicity', () => { for (let n = 1; n <= 7; n++) {
        expect(cantorValue(0, n)).toBe(0);
        expect(cantorValue(1, n)).toBe(1);
        expect(cantorValue(.4, n)).toBe(.5);
        expect(cantorValue(.6, n)).toBe(.5);
        let last = 0;
        for (let i = 0; i <= 1000; i++) {
            const v = cantorValue(i / 1000, n);
            expect(v).toBeGreaterThanOrEqual(last - 1e-14);
            last = v;
        }
    } });
    it('reproduces seeded samples and preserves covariance constraints', () => { expect(explorerResult('bootstrap', 200, 15, 7)).toEqual(explorerResult('bootstrap', 200, 15, 7)); expect(value('covariance', -1, 1, 'Varianza de suma')).toBe(0); expect(value('covariance', 1, 1, 'Varianza de suma')).toBe(4); });
    it('does not replace impossible selections with smaller selections', () => {
        expect(value('counting-principles', 2, 3, 'Con repetición y orden')).toBe(8);
        expect(value('counting-principles', 2, 3, 'Sin repetición y orden')).toBe(0);
        expect(value('counting-principles', 2, 3, 'Sin orden ni repetición')).toBe(0);
    });

});
