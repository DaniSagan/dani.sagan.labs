import { MathLabDefinition, MathLabResult } from '../../shared/math-lab.model';
const formatNumber = (x: number): string => Number(x.toPrecision(7)).toString();
export const lab: MathLabDefinition = {
    title: 'Etapas de Cantor y dimensión',
    prompt: "En cada intervalo conservamos dos copias reducidas. La razón es menor que la mitad para que exista un hueco entre ellas.",
    expression: "N_n=2^n,\\qquad L_n=(2r)^n,\\qquad d=\\frac{\\ln2}{\\ln(1/r)}",
    controls: [{ label: 'Etapa n', min: 0, max: 8, step: 1, value: 3 }, { label: 'Razón r', min: .1, max: .49, step: .01, value: .33 }],
    note: 'Las cifras son aproximaciones de máquina. Cambia un parámetro cada vez y explica el resultado con las ecuaciones del artículo: una visualización finita no constituye una demostración.',
    calculate: values => calculateLab(values[0], values[1]),
};
export function calculateLab(a: number, b: number): MathLabResult {
    if (!Number.isFinite(a) || !Number.isFinite(b))
        throw new Error('Parámetros del laboratorio no válidos');
    [a, b] = [a, b].map((v, i) => { const control = lab.controls[i]; return Math.max(control.min, Math.min(control.max, control.step === 1 ? Math.round(v) : v)); });
    const r: MathLabResult = { series: [], bounds: [-4, 4, -4, 4], rows: [], description: lab.prompt, xLabel: 'x', yLabel: 'y' };
    let intervals: [
        number,
        number
    ][] = [[0, 1]];
    for (let i = 0; i < a; i++)
        intervals = intervals.flatMap(([lo, hi]) => { const w = b * (hi - lo); return [[lo, lo + w], [hi - w, hi]] as [
            number,
            number
        ][]; });
    r.intervals = intervals;
    r.series = [{ label: 'Longitud restante', points: Array.from({ length: a + 1 }, (_, n) => [n, (2 * b) ** n]) }];
    r.bounds = [0, Math.max(1, a), 0, 1.1];
    r.xLabel = 'Etapa';
    r.yLabel = 'Longitud total';
    r.rows = [['Número de intervalos', formatNumber(2 ** a)], ['Longitud restante', formatNumber((2 * b) ** a)], ['Dimensión del límite', formatNumber(Math.log(2) / Math.log(1 / b))]];
    r.description += ' El dibujo corresponde a una etapa finita; la dimensión mostrada pertenece al conjunto límite, no a esa unión de intervalos.';
    r.intervalView = { title: 'Etapa finita del conjunto de Cantor', caption: 'Los huecos son abiertos; se conservan sus extremos. A gran profundidad algunos intervalos son menores que un píxel.' };
    return r;
}
