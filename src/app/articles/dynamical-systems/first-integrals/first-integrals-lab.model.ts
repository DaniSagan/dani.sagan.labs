import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
import { curve } from '../../shared/learning-math';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Energía exacta frente a un integrador',
    prompt: "Compara Euler explícito con Euler simpléctico durante aproximadamente diez unidades de tiempo. Ambos parten de la misma amplitud ajustable y velocidad nula.",
    expression: "x'=v,\\quad v'=-x,\\quad (x(0),v(0))=(A,0),\\quad H=\\tfrac12(x^2+v^2)",
    controls: [{ label: 'Paso h', min: .01, max: .2, step: .01, value: .1 }, { label: 'Amplitud inicial A', min: .5, max: 2, step: .1, value: 1 }],
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    let x = b, v = 0, sx = b, sv = 0;
    const e: [
        number,
        number
    ][] = [], s: [
        number,
        number
    ][] = [];
    const n = Math.round(10 / a);
    for (let i = 0; i <= n; i++) {
        e.push([i * a, (x * x + v * v) / 2]);
        s.push([i * a, (sx * sx + sv * sv) / 2]);
        const old = x;
        x += a * v;
        v -= a * old;
        sv -= a * sx;
        sx += a * sv;
    }
    r.series = [{ label: 'Euler explícito: energía', points: e }, { label: 'Euler simpléctico: energía', points: s }, curve('Energía exacta', () => b * b / 2, 0, n * a)];
    r.bounds = [0, n * a, 0, Math.max(...e.map(p => p[1]), ...s.map(p => p[1])) * 1.1];
    r.xLabel = 'Tiempo';
    r.yLabel = 'Energía';
    r.rows = [['Energía inicial', formatNumber(b * b / 2)], ['Energía final Euler explícito', formatNumber(e[n][1])], ['Energía final Euler simpléctico', formatNumber(s[n][1])]];
    return r;
}
