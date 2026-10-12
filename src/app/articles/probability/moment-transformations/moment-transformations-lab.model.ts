import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Trasladar y escalar cuatro datos',
    prompt: "Transformamos los cuatro datos del ejemplo con una escala y una traslación. Explora también escalas negativas y nulas.",
    expression: "Y=aX+b,\\qquad E(Y)=4a+b,\\qquad\\operatorname{Var}(Y)=2a^2",
    controls: [{ label: 'Escala a', min: -3, max: 3, step: .1, value: 1.8 }, { label: 'Traslación b', min: -10, max: 32, step: 1, value: 32 }],
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    const data = [2, 4, 4, 6];
    r.series = [{ label: 'Datos originales', points: data.map((x, i) => [i + 1, x]) }, { label: 'Datos transformados', points: data.map((x, i) => [i + 1, a * x + b]) }];
    const ys = [...data, ...data.map(x => a * x + b)];
    r.bounds = [.5, 4.5, Math.min(...ys) - 2, Math.max(...ys) + 2];
    r.xLabel = 'Observación';
    r.yLabel = 'Valor';
    r.rows = [['Media transformada', formatNumber(4 * a + b)], ['Varianza descriptiva', formatNumber(2 * a * a)], ['Desviación típica', formatNumber(Math.sqrt(2) * Math.abs(a))]];
    return r;
}
