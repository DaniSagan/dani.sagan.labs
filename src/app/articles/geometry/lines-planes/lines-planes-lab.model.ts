import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Proyección y segmento normal',
    prompt: "La perspectiva paralela muestra un parche del plano centrado en la proyección y el segmento normal. Las distancias se calculan en tres dimensiones, no en la pantalla.",
    expression: "\\pi:\\ x+y+z=d,\\qquad P=(1,2,z),\\qquad Q=P-\\frac{3+z-d}{3}(1,1,1)",
    controls: [{ label: 'Altura z de P', min: -4, max: 6, step: .1, value: 3 }, { label: 'Constante d del plano', min: -3, max: 9, step: .1, value: 0 }],
    equalAspectRatio: true,
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    const t = (3 + a - b) / 3, q = [1 - t, 2 - t, a - t];
    const project = (p: number[]): [
        number,
        number
    ] => [p[0] - .6 * p[1], p[2] - .35 * (p[0] + p[1])];
    const corners = [[-2, -2], [2, -2], [2, 2], [-2, 2], [-2, -2]].map(([s, t]) => project([q[0] + s, q[1] - s + t, q[2] - t]));
    r.series = [{ label: 'Parche del plano (perspectiva)', points: corners }, { label: 'Segmento normal P → Q', points: [project([1, 2, a]), project(q)] }];
    const pts = r.series.flatMap(s => s.points);
    r.bounds = [Math.min(...pts.map(p => p[0])) - 1, Math.max(...pts.map(p => p[0])) + 1, Math.min(...pts.map(p => p[1])) - 1, Math.max(...pts.map(p => p[1])) + 1];
    r.xLabel = 'Proyección horizontal';
    r.yLabel = 'Proyección vertical';
    r.rows = [['Proyección Q', q.map(formatNumber).join(', ')], ['Distancia en 3D', formatNumber(Math.abs(3 + a - b) / Math.sqrt(3))], ['Residuo xQ + yQ + zQ − d', formatNumber(q.reduce((s, x) => s + x, 0) - b)]];
    const pp = project([1, 2, a]), pq = project(q);
    r.markers = [{ x: pp[0], y: pp[1], label: 'Punto P' }, { x: pq[0], y: pq[1], label: 'Proyección Q', color: '#4a9eff' }];
    return r;
}
