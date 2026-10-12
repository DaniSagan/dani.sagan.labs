import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
import { curve } from '../../shared/learning-math';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Una secante que se acerca a la tangente',
    prompt: "Para la función cuadrática, compara una secante con la tangente en el punto de contacto. El incremento siempre es positivo.",
    expression: "f(x)=x^2,\\qquad\\frac{f(a+h)-f(a)}h=2a+h,\\qquad f'(a)=2a",
    controls: [{ label: 'Punto a', min: -2, max: 2, step: .1, value: 1 }, { label: 'Incremento h', min: .001, max: 2, step: .001, value: 1 }],
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    r.series = [curve('formatNumber(x) = x²', x => x * x, -3, 4), curve('Secante', x => a * a + (2 * a + b) * (x - a), -3, 4), curve('Tangente', x => a * a + 2 * a * (x - a), -3, 4)];
    r.bounds = [-3, 4, -5, 16];
    r.rows = [['Cociente incremental', formatNumber(2 * a + b)], ['Derivada en a', formatNumber(2 * a)], ['Error de pendiente', formatNumber(b)]];
    r.markers = [{ x: a, y: a * a, label: 'Contacto a' }, { x: a + b, y: (a + b) ** 2, label: 'Segundo punto de la secante' }];
    return r;
}
