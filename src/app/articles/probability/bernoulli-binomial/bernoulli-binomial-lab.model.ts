import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
import { binomial } from '../../shared/learning-math';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'De un ensayo a un recuento',
    prompt: "Predice el centro y la dispersión antes de cambiar el número de ensayos o su probabilidad. Las barras son probabilidades exactas del modelo.",
    expression: "X\\sim\\operatorname{Bin}(n,p),\\qquad E(X)=np,\\qquad\\operatorname{Var}(X)=np(1-p)",
    controls: [{ label: 'Número de ensayos n', min: 1, max: 40, step: 1, value: 5 }, { label: 'Probabilidad de éxito p', min: 0, max: 1, step: .01, value: .5 }],
    barWidth: 10,
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    const p = binomial(a, b);
    r.series = [{ label: 'P(X = k)', kind: 'bars', points: p.map((v, k) => [k, v]) }];
    r.bounds = [-.5, a + .5, 0, Math.max(...p) * 1.15];
    r.xLabel = 'Número de éxitos k';
    r.yLabel = 'Probabilidad';
    r.rows = [['Esperanza', formatNumber(a * b)], ['Varianza', formatNumber(a * b * (1 - b))], ['Suma de probabilidades', formatNumber(p.reduce((s, x) => s + x, 0))]];
    return r;
}
