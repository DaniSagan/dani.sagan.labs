import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
import { curve, normalCdf } from '../../shared/learning-math';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Un umbral, una probabilidad',
    prompt: "La normal tiene media cincuenta. Cambia su desviación y el umbral; compara el área sombreada con la altura de la curva.",
    expression: "X\\sim N(50,\\sigma^2),\\qquad z=\\frac{x-50}{\\sigma},\\qquad P(X\\le x)=\\Phi(z)",
    controls: [{ label: 'Desviación típica σ', min: 1, max: 15, step: .5, value: 10 }, { label: 'Umbral x', min: 20, max: 80, step: .5, value: 60 }],
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    const density = (x: number) => Math.exp(-.5 * ((x - 50) / a) ** 2) / (a * Math.sqrt(2 * Math.PI));
    const lo = Math.min(50 - 4 * a, b), hi = Math.max(50 + 4 * a, b);
    r.series = [curve('Densidad', density, lo, hi), { ...curve('Área hasta el umbral (ventana visible)', density, lo, b), kind: 'area' }];
    r.bounds = [lo, hi, 0, density(50) * 1.15];
    r.xLabel = 'Valor x';
    r.yLabel = 'Densidad';
    r.rows = [['z = (x − 50)/σ', formatNumber((b - 50) / a)], ['P(X ≤ x), aproximación', formatNumber(normalCdf((b - 50) / a))], ['Densidad en x', formatNumber(density(b))]];
    r.markers = [{ x: b, y: density(b), label: 'Umbral x' }];
    r.description += ' El área numérica incluye la cola fuera de la ventana; Φ se aproxima con error absoluto de alrededor de 10⁻⁷.';
    return r;
}
