import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
import { curve } from '../../shared/learning-math';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Una función y su inversa',
    prompt: "Compara la exponencial con su inversa, reflejadas respecto a la bisectriz del primer cuadrante. Las bases se mantienen mayores que uno.",
    expression: "y=b^x,\\qquad y=\\log_b x,\\qquad\\log_b(b^t)=t",
    controls: [{ label: 'Base b', min: 1.1, max: 4, step: .1, value: 2 }, { label: 'Abscisa de la exponencial t', min: -2, max: 2, step: .1, value: 1 }],
    equalAspectRatio: true,
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    r.series = [curve('bˣ', x => a ** x, -3, 3), curve('log_b(x)', x => Math.log(x) / Math.log(a), .02, 6), curve('y = x', x => x, -3, 6)];
    r.bounds = [-3, 6, -3, 6];
    r.rows = [['bᵗ', formatNumber(a ** b)], ['log_b(bᵗ)', formatNumber(Math.log(a ** b) / Math.log(a))], ['Derivada de bˣ en t', formatNumber(Math.log(a) * a ** b)]];
    r.markers = [{ x: b, y: a ** b, label: 'Punto de la exponencial' }, { x: a ** b, y: b, label: 'Punto reflejado de la inversa' }];
    return r;
}
