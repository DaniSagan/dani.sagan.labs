import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
import { curve } from '../../shared/learning-math';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Secante, tangente o exterior',
    prompt: "Compara la distancia de la recta al centro con el radio de la circunferencia para decidir su intersección.",
    expression: "x^2+y^2=R^2,\\qquad y=x+b,\\qquad d=\\frac{|b|}{\\sqrt2}",
    controls: [{ label: 'Radio R', min: .5, max: 4, step: .1, value: 2 }, { label: 'Ordenada b', min: -6, max: 6, step: .1, value: 1 }],
    equalAspectRatio: true,
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    r.series = [{ label: 'Circunferencia', points: Array.from({ length: 241 }, (_, i) => [a * Math.cos(i * Math.PI / 120), a * Math.sin(i * Math.PI / 120)]) }, curve('y = x + b', x => x + b, -5, 5)];
    const d = Math.abs(b) / Math.SQRT2, disc = 8 * a * a - 4 * b * b;
    r.rows = [['Distancia al centro', formatNumber(d)], ['Clasificación', Math.abs(d - a) < 1e-10 ? 'Tangente' : d < a ? 'Secante' : 'Exterior'], ['Discriminante', formatNumber(disc)]];
    if (d < a) {
        const q = Math.sqrt(2 * a * a - b * b), xs = [(-b - q) / 2, (-b + q) / 2];
        r.rows.push(['Abscisas de corte', xs.map(formatNumber).join('; ')]);
        r.markers = xs.map(x => ({ x, y: x + b, label: 'Intersección' }));
    }
    else if (Math.abs(d - a) < 1e-10)
        r.markers = [{ x: -b / 2, y: b / 2, label: 'Punto de tangencia' }];
    r.bounds = [-11, 11, -5, 5];
    return r;
}
