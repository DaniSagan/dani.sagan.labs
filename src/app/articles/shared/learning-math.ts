import { PlotSeries } from './learning-plot.component';
export function curve(label: string, fn: (x: number) => number, lo: number, hi: number, color?: string, count = 401): PlotSeries {
    return { label, color, points: Array.from({ length: count }, (_, i) => { const x = lo + (hi - lo) * i / (count - 1); return [x, fn(x)]; }) };
}
export function choose(n: number, k: number): number {
    if (k < 0 || k > n || !Number.isInteger(k))
        return 0;
    let result = 1;
    for (let i = 1; i <= Math.min(k, n - k); i++)
        result *= (n - i + 1) / i;
    return result;
}
export function hypergeometric(N: number, K: number, n: number): number[] {
    return Array.from({ length: n + 1 }, (_, k) => choose(K, k) * choose(N - K, n - k) / choose(N, n));
}
export function binomial(n: number, p: number): number[] {
    return Array.from({ length: n + 1 }, (_, k) => choose(n, k) * p ** k * (1 - p) ** (n - k));
}
export function normalCdf(x: number): number {
    const z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + .3275911 * z);
    const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - .284496736) * t + .254829592) * t * Math.exp(-z * z);
    return .5 * (1 + (x < 0 ? -erf : erf));
}
export function normalQuantile(p: number): number {
    let lo = -9, hi = 9;
    for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        if (normalCdf(mid) < p)
            lo = mid;
        else
            hi = mid;
    }
    return (lo + hi) / 2;
}
export function gaussian(random: () => number = Math.random): number {
    return Math.sqrt(-2 * Math.log(Math.max(Number.MIN_VALUE, random()))) * Math.cos(2 * Math.PI * random());
}
/** Coefficients in ascending powers. Divides without evaluating at sample points. */
export function dividePolynomial(dividend: number[], divisor: number[]): {
    quotient: number[];
    remainder: number[];
} {
    const d = [...divisor];
    while (d.length > 1 && d[d.length - 1] === 0)
        d.pop();
    if (d[d.length - 1] === 0)
        throw new Error('El divisor no puede ser cero');
    const r = [...dividend];
    while (r.length > 1 && r[r.length - 1] === 0)
        r.pop();
    const q = Array(Math.max(1, r.length - d.length + 1)).fill(0);
    for (let power = r.length - d.length; power >= 0; power--) {
        const factor = r[power + d.length - 1] / d[d.length - 1];
        q[power] = factor;
        for (let j = 0; j < d.length; j++)
            r[power + j] -= factor * d[j];
    }
    return { quotient: q, remainder: r.slice(0, Math.max(1, d.length - 1)) };
}
export function evaluatePolynomial(coefficients: number[], x: number): number { return coefficients.reduceRight((value, c) => value * x + c, 0); }
export function polynomialText(coefficients: number[]): string {
    return coefficients.map((c, i) => ({ c, i })).reverse().filter(t => Math.abs(t.c) > 1e-10).map(({ c, i }, index) => `${c < 0 ? '− ' : index ? '+ ' : ''}${Math.abs(c) === 1 && i ? '' : Number(Math.abs(c).toPrecision(5))}${i ? (i === 1 ? 'x' : 'x^' + i) : ''}`).join(' ') || '0';
}
export function quadraticRoots(a: number, b: number, c: number): {
    discriminant: number;
    real: number[];
    kind: string;
} {
    const discriminant = b * b - 4 * a * c;
    if (a === 0)
        return { discriminant, real: b ? [-c / b] : [], kind: b ? 'Ecuación lineal' : c ? 'Sin solución' : 'Todo número es solución' };
    if (discriminant < 0)
        return { discriminant, real: [], kind: 'Dos raíces complejas conjugadas' };
    if (discriminant === 0)
        return { discriminant, real: [-b / (2 * a)], kind: 'Raíz real doble' };
    const q = -.5 * (b + (b >= 0 ? 1 : -1) * Math.sqrt(discriminant));
    return { discriminant, real: [q / a, c / q].sort((x, y) => x - y), kind: 'Dos raíces reales distintas' };
}
