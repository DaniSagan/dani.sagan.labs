import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Rotación, espiral y estabilidad',
    prompt: "Desde el estado inicial del ejemplo, compara rotación y crecimiento o decaimiento exponencial. La curva se obtiene con la solución exacta de esta familia.",
    expression: "A=\\begin{pmatrix}\\alpha&-1\\\\1&\\alpha\\end{pmatrix},\\qquad x(t)=2e^{\\alpha t}(\\cos t,\\sin t)",
    controls: [{ label: 'Parte real α', min: -.3, max: .3, step: .01, value: 0 }, { label: 'Tiempo final t', min: 1, max: 12, step: .1, value: 6.3 }],
    equalAspectRatio: true,
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    const radius = 2 * Math.exp(Math.max(0, a * b));
    r.series = [{ label: 'Trayectoria exacta', points: Array.from({ length: 401 }, (_, i) => { const t = b * i / 400; return [2 * Math.exp(a * t) * Math.cos(t), 2 * Math.exp(a * t) * Math.sin(t)]; }) }];
    r.bounds = [-radius * 2.5, radius * 2.5, -radius * 1.15, radius * 1.15];
    r.xLabel = 'x';
    r.yLabel = 'y';
    r.rows = [['Radio final', formatNumber(2 * Math.exp(a * b))], ['Autovalores', formatNumber(a) + ' ± i'], ['Origen', a < 0 ? 'Asintóticamente estable' : a === 0 ? 'Estable, sin atracción' : 'Inestable']];
    const endpoint = r.series[0].points[400];
    r.markers = [{ x: 2, y: 0, label: 'Estado inicial' }, { x: endpoint[0], y: endpoint[1], label: 'Estado final' }, { x: 0, y: 0, label: 'Equilibrio' }];
    return r;
}
