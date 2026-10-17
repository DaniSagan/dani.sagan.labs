import { LATEX_SYMBOLS } from './latex-symbols';
import type { Selector } from 'mathlive';
export interface FormulaKey {
  label: string;
  latex: string;
  group: string;
  name: string;
  command?: Selector;
  accent?: string;
}
const templates: FormulaKey[] = [];
function add(group: string, entries: [string, string, string][]) {
  for (const [label, latex, name] of entries)
    templates.push({ group, label, latex, name });
}
add('Esenciales', [
  ['a/b', '\\frac{#0}{#?}', 'fracción numerador denominador'],
  ['xⁿ', '{#0}^{#?}', 'potencia exponente'],
  ['xₙ', '{#0}_{#?}', 'subíndice'],
  ['√', '\\sqrt{#0}', 'raíz cuadrada'],
  ['ⁿ√', '\\sqrt[#?]{#0}', 'raíz enésima'],
  ['( )', '\\left(#0\\right)', 'paréntesis'],
  ['|x|', '\\left|#0\\right|', 'valor absoluto'],
  ['±', '\\pm', 'más menos'],
  ['×', '\\times', 'multiplicación'],
  ['÷', '\\div', 'división'],
  ['∞', '\\infty', 'infinito'],
  ['π', '\\pi', 'pi'],
]);
add('Cálculo', [
  ['∫', '\\int_{#?}^{#?} #0\\,\\mathrm{d}x', 'integral definida'],
  ['∫ dx', '\\int #0\\,\\mathrm{d}x', 'integral indefinida'],
  ['∬', '\\iint #0\\,\\mathrm{d}A', 'integral doble'],
  ['∭', '\\iiint #0\\,\\mathrm{d}V', 'integral triple'],
  ['∮', '\\oint #0\\,\\mathrm{d}s', 'integral contorno'],
  ['Σ', '\\sum_{n=#?}^{#?}#0', 'sumatorio'],
  ['Π', '\\prod_{n=#?}^{#?}#0', 'producto'],
  ['lim', '\\lim_{x\\to #?}#0', 'límite'],
  ['d/dx', '\\frac{\\mathrm{d}}{\\mathrm{d}x}#0', 'derivada'],
  ['∂/∂x', '\\frac{\\partial}{\\partial x}#0', 'derivada parcial'],
  ['∇', '\\nabla #0', 'gradiente nabla'],
  ['Δ', '\\Delta #0', 'laplaciano delta'],
]);
add('Matrices', [
  [
    '2×2',
    '\\begin{pmatrix}#0&#?\\\\#?&#?\\end{pmatrix}',
    'matriz dos filas columnas',
  ],
  [
    '3×3',
    '\\begin{pmatrix}#0&#?&#?\\\\#?&#?&#?\\\\#?&#?&#?\\end{pmatrix}',
    'matriz tres',
  ],
  ['[A]', '\\begin{bmatrix}#0&#?\\\\#?&#?\\end{bmatrix}', 'matriz corchetes'],
  ['det', '\\begin{vmatrix}#0&#?\\\\#?&#?\\end{vmatrix}', 'determinante'],
  [
    'casos',
    '\\begin{cases}#0&x>0\\\\#?&x\\le0\\end{cases}',
    'función por partes casos',
  ],
  [
    'alinear',
    '\\begin{aligned}#0&=#?\\\\#?&=#?\\end{aligned}',
    'ecuaciones alineadas',
  ],
  ['a/b', '\\binom{#0}{#?}', 'binomial combinatoria'],
  ['‖x‖', '\\left\\lVert #0\\right\\rVert', 'norma'],
  ['⟨x,y⟩', '\\left\\langle #0,#?\\right\\rangle', 'producto escalar'],
]);
add('Acentos y estilo', [
  ['x⃗', '\\vec{#0}', 'vector'],
  ['x̂', '\\hat{#0}', 'sombrero'],
  ['x̄', '\\overline{#0}', 'barra superior'],
  ['x̃', '\\widetilde{#0}', 'tilde'],
  ['ẋ', '\\dot{#0}', 'punto derivada'],
  ['ẍ', '\\ddot{#0}', 'doble punto'],
  ['⏟', '\\underbrace{#0}_{#?}', 'llave inferior'],
  ['⏞', '\\overbrace{#0}^{#?}', 'llave superior'],
  ['𝐱', '\\mathbf{#0}', 'negrita'],
  ['ℝ', '\\mathbb{R}', 'reales'],
  ['ℂ', '\\mathbb{C}', 'complejos'],
  ['ℕ', '\\mathbb{N}', 'naturales'],
  ['ℤ', '\\mathbb{Z}', 'enteros'],
  ['ℚ', '\\mathbb{Q}', 'racionales'],
  ['𝒜', '\\mathcal{#0}', 'caligráfica'],
  ['𝔄', '\\mathfrak{#0}', 'fraktur'],
  ['texto', '\\text{#?}', 'texto'],
  ['espacio', '\\quad', 'espacio ancho'],
  ['fino', '\\,', 'espacio fino'],
  ['sin espacio', '\\!', 'espacio negativo'],
]);
for (const [label, command, name] of [
  ['＋ fila', 'addRowAfter', 'añadir fila debajo'],
  ['↑ fila', 'addRowBefore', 'añadir fila encima'],
  ['− fila', 'removeRow', 'eliminar fila'],
  ['＋ col', 'addColumnAfter', 'añadir columna derecha'],
  ['← col', 'addColumnBefore', 'añadir columna izquierda'],
  ['− col', 'removeColumn', 'eliminar columna'],
] as [string, Selector, string][])
  templates.push({ label, command, name, latex: '', group: 'Matrices' });
add(
  'Funciones',
  [
    'sin',
    'cos',
    'tan',
    'cot',
    'sec',
    'csc',
    'arcsin',
    'arccos',
    'arctan',
    'sinh',
    'cosh',
    'tanh',
    'coth',
    'log',
    'ln',
    'exp',
    'min',
    'max',
    'sup',
    'inf',
    'gcd',
    'det',
    'ker',
    'dim',
    'arg',
    'Pr',
    'hom',
    'deg',
  ].map((x) => [x, `\\${x}\\left(#0\\right)`, x]),
);
add('Delimitadores', [
  ['[ ]', '\\left[#0\\right]', 'corchetes'],
  ['{ }', '\\left\\{#0\\right\\}', 'llaves'],
  ['⌊x⌋', '\\left\\lfloor #0\\right\\rfloor', 'suelo parte entera'],
  ['⌈x⌉', '\\left\\lceil #0\\right\\rceil', 'techo'],
  ['⟨ ⟩', '\\left\\langle #0\\right\\rangle', 'ángulos'],
  ['⟦ ⟧', '\\left[\\!\\left[#0\\right]\\!\\right]', 'corchetes grandes'],
]);
add(
  'Letras y cifras',
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-=.,!'
    .split('')
    .map((x) => [x, x, x]),
);
const accentCommands: Record<string, string> = {
  vec: 'vector',
  hat: 'hat',
  overline: 'bar',
  widetilde: 'tilde',
  dot: 'dot',
  ddot: 'ddot',
};
for (const key of templates) {
  const command = key.latex.match(/^\\([a-z]+)\{#0\}$/)?.[1];
  if (command && accentCommands[command]) key.accent = accentCommands[command];
}
export const FORMULA_KEYS: FormulaKey[] = [...templates, ...LATEX_SYMBOLS];
export const KEY_GROUPS = [...new Set(FORMULA_KEYS.map((x) => x.group))];
