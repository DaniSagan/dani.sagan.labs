import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Contar pares de dados',
    prompt: "Condicionamos a que el primer dado sea par y estudiamos una suma objetivo. Solo usamos dados equilibrados e independientes.",
    expression: "A=\\{\\text{primer dado par}\\},\\quad B=\\{X_1+X_2=s\\},\\quad P(B\\mid A)=\\frac{P(A\\cap B)}{P(A)}",
    controls: [{ label: 'Caras por dado m', min: 2, max: 12, step: 1, value: 6 }, { label: 'Suma objetivo s', min: 2, max: 24, step: 1, value: 8 }],
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    const counts = Array.from({ length: 2 * a - 1 }, (_, i) => { const s = i + 2; let k = 0; for (let x = 1; x <= a; x++)
        if (s - x >= 1 && s - x <= a)
            k++; return [s, k / (a * a)] as [
        number,
        number
    ]; });
    const evens = Math.floor(a / 2);
    let joint = 0;
    for (let x = 2; x <= a; x += 2)
        if (b - x >= 1 && b - x <= a)
            joint++;
    const pb = counts.find(p => p[0] === b)?.[1] || 0, pa = evens / a;
    r.series = [{ label: 'Distribución de la suma', kind: 'bars', points: counts }];
    r.bounds = [1, Math.max(2 * a, b) + 1, 0, 1 / a * 1.2];
    r.xLabel = 'Suma';
    r.yLabel = 'Probabilidad';
    r.rows = [['P(A)', formatNumber(pa)], ['P(B)', formatNumber(pb)], ['P(B | A)', formatNumber(joint / (evens * a))], ['Independencia en este modelo', Math.abs(joint / (a * a) - pa * pb) < 1e-12 ? 'Sí' : 'No']];
    return r;
}
