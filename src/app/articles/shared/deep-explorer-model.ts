import { TextLink } from '../../shared/content/linked-text.component';
import { PlotSeries } from './learning-plot.component';
export interface ExplorerControl {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
}
export interface ExplorerResult {
    series: PlotSeries[];
    rows: [
        string,
        string
    ][];
    explanation: string;
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    cells?: string[][];
}
export const EXPLORER_CONFIGS: Record<string, {
    title: string;
    controls: ExplorerControl[];
    conceptLinks?: readonly TextLink[];
}> = {
  "counting-principles": {
    "title": "Etapas de una elección",
    "controls": [
      {
        "label": "Opciones disponibles",
        "min": 2,
        "max": 12,
        "step": 1,
        "value": 6
      },
      {
        "label": "Elementos elegidos",
        "min": 1,
        "max": 6,
        "step": 1,
        "value": 3
      }
    ]
  ,
    conceptLinks: []
},
  "inclusion-exclusion": {
    "title": "Solapamiento",
    "controls": [
      {
        "label": "Tamaño de A",
        "min": 0,
        "max": 20,
        "step": 1,
        "value": 12
      },
      {
        "label": "Tamaño de B",
        "min": 0,
        "max": 20,
        "step": 1,
        "value": 9
      }
    ]
  ,
    conceptLinks: []
},
  "mathematical-induction": {
    "title": "Identidad por inducción",
    "controls": [
      {
        "label": "Último término",
        "min": 1,
        "max": 30,
        "step": 1,
        "value": 8
      },
      {
        "label": "Potencia",
        "min": 1,
        "max": 3,
        "step": 1,
        "value": 1
      }
    ]
  ,
    conceptLinks: []
},
  "rational-root-theorem": {
    "title": "Candidatos racionales",
    "controls": [
      {
        "label": "Coeficiente principal",
        "min": 1,
        "max": 8,
        "step": 1,
        "value": 2
      },
      {
        "label": "Término independiente",
        "min": 1,
        "max": 12,
        "step": 1,
        "value": 3
      }
    ]
  ,
    conceptLinks: []
},
  "sign-charts": {
    "title": "Signos y multiplicidades",
    "controls": [
      {
        "label": "Raíz variable",
        "min": -3,
        "max": 3,
        "step": 0.1,
        "value": 1
      },
      {
        "label": "Multiplicidad",
        "min": 1,
        "max": 3,
        "step": 1,
        "value": 1
      }
    ]
  ,
    conceptLinks: []
},
  "polynomial-interpolation": {
    "title": "Nodos y error",
    "controls": [
      {
        "label": "Grado",
        "min": 1,
        "max": 12,
        "step": 1,
        "value": 5
      },
      {
        "label": "Punto de evaluación",
        "min": -1,
        "max": 1,
        "step": 0.01,
        "value": 0.4
      }
    ]
  ,
    conceptLinks: []
},
  "vector-spaces": {
    "title": "Rango y núcleo",
    "controls": [
      {
        "label": "Parámetro",
        "min": -2,
        "max": 2,
        "step": 0.1,
        "value": 0
      },
      {
        "label": "Coordenada",
        "min": 0,
        "max": 4,
        "step": 0.1,
        "value": 1
      }
    ]
  ,
    conceptLinks: []
},
  "gram-schmidt": {
    "title": "Dirección y longitud",
    "controls": [
      {
        "label": "Casi paralelismo",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "value": 0.3
      },
      {
        "label": "Escala",
        "min": 1,
        "max": 5,
        "step": 0.1,
        "value": 2
      }
    ]
  ,
    conceptLinks: []
},
  "projection-least-squares": {
    "title": "Ajuste y proyección",
    "controls": [
      {
        "label": "Pendiente",
        "min": -2,
        "max": 3,
        "step": 0.1,
        "value": 1
      },
      {
        "label": "Desviación central",
        "min": -3,
        "max": 3,
        "step": 0.1,
        "value": 1
      }
    ]
  ,
    conceptLinks: []
},
  "pythagorean-distance": {
    "title": "Distancia euclídea",
    "controls": [
      {
        "label": "Componente horizontal",
        "min": 0,
        "max": 8,
        "step": 0.1,
        "value": 3
      },
      {
        "label": "Componente vertical",
        "min": 0,
        "max": 8,
        "step": 0.1,
        "value": 4
      }
    ]
  ,
    conceptLinks: []
},
  "triangle-similarity": {
    "title": "Escalar una figura",
    "controls": [
      {
        "label": "Razón",
        "min": 0.2,
        "max": 4,
        "step": 0.1,
        "value": 2
      },
      {
        "label": "Lado original",
        "min": 1,
        "max": 6,
        "step": 0.1,
        "value": 3
      }
    ]
  ,
    conceptLinks: [{"term":"homotecia","route":"/articles/homothety"}]
},
  "sine-law": {
    "title": "Triángulos posibles",
    "controls": [
      {
        "label": "Ángulo A (grados)",
        "min": 10,
        "max": 85,
        "step": 1,
        "value": 30
      },
      {
        "label": "Lado a",
        "min": 1,
        "max": 10,
        "step": 0.1,
        "value": 4
      }
    ]
  ,
    conceptLinks: []
},
  "complex-arithmetic": {
    "title": "División en el plano",
    "controls": [
      {
        "label": "Parte real",
        "min": -4,
        "max": 4,
        "step": 0.1,
        "value": 2
      },
      {
        "label": "Parte imaginaria",
        "min": -4,
        "max": 4,
        "step": 0.1,
        "value": 3
      }
    ]
  ,
    conceptLinks: []
},
  "geometric-series": {
    "title": "Sumas parciales",
    "controls": [
      {
        "label": "Razón",
        "min": -1.5,
        "max": 1.5,
        "step": 0.05,
        "value": 0.5
      },
      {
        "label": "Términos",
        "min": 1,
        "max": 40,
        "step": 1,
        "value": 10
      }
    ]
  ,
    conceptLinks: []
},
  "positive-series-tests": {
    "title": "Frontera de convergencia",
    "controls": [
      {
        "label": "Exponente",
        "min": 0.2,
        "max": 3,
        "step": 0.05,
        "value": 1.5
      },
      {
        "label": "Términos",
        "min": 10,
        "max": 500,
        "step": 10,
        "value": 100
      }
    ]
  ,
    conceptLinks: []
},
  "lhopital-rule": {
    "title": "Un cociente cerca del límite",
    "controls": [
      {
        "label": "Distancia al origen",
        "min": 1e-06,
        "max": 0.1,
        "step": 1e-06,
        "value": 0.01
      },
      {
        "label": "Orden",
        "min": 1,
        "max": 4,
        "step": 1,
        "value": 2
      }
    ]
  ,
    conceptLinks: [{"term":"resto de Taylor","route":"/articles/taylor-series"}]
},
  "linear-approximation": {
    "title": "Resto de Taylor",
    "controls": [
      {
        "label": "Centro",
        "min": 0.5,
        "max": 4,
        "step": 0.1,
        "value": 1
      },
      {
        "label": "Incremento",
        "min": -0.4,
        "max": 0.4,
        "step": 0.01,
        "value": 0.2
      }
    ]
  ,
    conceptLinks: [{"term":"cóncava","route":"/articles/convexity-tangents"}]
},
  "banach-fixed-point": {
    "title": "Iterar una contracción",
    "controls": [
      {
        "label": "Constante",
        "min": -0.95,
        "max": 0.95,
        "step": 0.05,
        "value": 0.5
      },
      {
        "label": "Punto inicial",
        "min": -4,
        "max": 4,
        "step": 0.1,
        "value": 3
      }
    ]
  ,
    conceptLinks: []
},
  "numerical-conditioning": {
    "title": "Cancelación",
    "controls": [
      {
        "label": "Exponente decimal",
        "min": 2,
        "max": 16,
        "step": 1,
        "value": 8
      },
      {
        "label": "Perturbación relativa",
        "min": 0.0001,
        "max": 0.1,
        "step": 0.0001,
        "value": 0.01
      }
    ]
  ,
    conceptLinks: []
},
  "ode-numerical-integration": {
    "title": "Euler, Heun y RK4",
    "controls": [
      {
        "label": "Paso",
        "min": 0.02,
        "max": 0.5,
        "step": 0.02,
        "value": 0.2
      },
      {
        "label": "Duración",
        "min": 1,
        "max": 5,
        "step": 0.2,
        "value": 2
      }
    ]
  ,
    conceptLinks: []
},
  "large-numbers-law": {
    "title": "Medias de Bernoulli",
    "controls": [
      {
        "label": "Probabilidad",
        "min": 0.05,
        "max": 0.95,
        "step": 0.05,
        "value": 0.4
      },
      {
        "label": "Tamaño",
        "min": 10,
        "max": 1000,
        "step": 10,
        "value": 200
      }
    ]
  ,
    conceptLinks: []
},
  "probability-inequalities": {
    "title": "Garantías de concentración",
    "controls": [
      {
        "label": "Desviación objetivo",
        "min": 0.05,
        "max": 0.5,
        "step": 0.01,
        "value": 0.2
      },
      {
        "label": "Tamaño",
        "min": 5,
        "max": 200,
        "step": 5,
        "value": 50
      }
    ]
  ,
    conceptLinks: []
},
  "covariance": {
    "title": "Dependencia y dispersión",
    "controls": [
      {
        "label": "Correlación",
        "min": -1,
        "max": 1,
        "step": 0.05,
        "value": 0.5
      },
      {
        "label": "Desviación de Y",
        "min": 0.2,
        "max": 3,
        "step": 0.1,
        "value": 1
      }
    ]
  ,
    conceptLinks: []
},
  "student-chi-square": {
    "title": "Colas y grados de libertad",
    "controls": [
      {
        "label": "Grados de libertad",
        "min": 1,
        "max": 30,
        "step": 1,
        "value": 5
      },
      {
        "label": "Valor",
        "min": 0.1,
        "max": 8,
        "step": 0.1,
        "value": 2
      }
    ]
  ,
    conceptLinks: [{"term":"Cuadrado","route":"/articles/square"}]
},
  "proportion-intervals": {
    "title": "Intervalos para una proporción",
    "controls": [
      {
        "label": "Ensayos",
        "min": 5,
        "max": 100,
        "step": 1,
        "value": 20
      },
      {
        "label": "Proporción observada",
        "min": 0,
        "max": 1,
        "step": 0.05,
        "value": 0.1
      }
    ]
  ,
    conceptLinks: []
},
  "statistical-power": {
    "title": "Curva de potencia",
    "controls": [
      {
        "label": "Tamaño",
        "min": 5,
        "max": 200,
        "step": 5,
        "value": 50
      },
      {
        "label": "Efecto en unidades de sigma",
        "min": 0,
        "max": 1,
        "step": 0.02,
        "value": 0.4
      }
    ]
  ,
    conceptLinks: [{"term":"aproximación normal","route":"/articles/proportion-intervals"}]
},
  "bootstrap": {
    "title": "Bootstrap de una muestra",
    "controls": [
      {
        "label": "Réplicas",
        "min": 50,
        "max": 500,
        "step": 50,
        "value": 200
      },
      {
        "label": "Valor extremo",
        "min": 5,
        "max": 40,
        "step": 1,
        "value": 15
      }
    ]
  ,
    conceptLinks: []
},
  "causal-inference": {
    "title": "Comparar dentro de grupos",
    "controls": [
      {
        "label": "Casos fáciles tratados",
        "min": 0.05,
        "max": 0.95,
        "step": 0.05,
        "value": 0.8
      },
      {
        "label": "Casos fáciles control",
        "min": 0.05,
        "max": 0.95,
        "step": 0.05,
        "value": 0.2
      }
    ]
  ,
    conceptLinks: [{"term":"Simpson","route":"/articles/integration-numerical","fragment":"newton-cotes"}]
},
  "stratified-sampling": {
    "title": "Ponderar estratos",
    "controls": [
      {
        "label": "Peso poblacional del estrato 1",
        "min": 0.1,
        "max": 0.9,
        "step": 0.05,
        "value": 0.7
      },
      {
        "label": "Fracción muestral del estrato 1",
        "min": 0.1,
        "max": 0.9,
        "step": 0.05,
        "value": 0.3
      }
    ]
  ,
    conceptLinks: []
},
  "burnside-lemma": {
    "title": "Órbitas de rotación",
    "controls": [
      {
        "label": "Posiciones",
        "min": 3,
        "max": 8,
        "step": 1,
        "value": 4
      },
      {
        "label": "Colores",
        "min": 2,
        "max": 4,
        "step": 1,
        "value": 2
      }
    ]
  ,
    conceptLinks: []
},
  "rubik-invariants": {
    "title": "Invariantes del cubo",
    "controls": [
      {
        "label": "Suma de giros de esquinas",
        "min": 0,
        "max": 8,
        "step": 1,
        "value": 0
      },
      {
        "label": "Suma de volteos de aristas",
        "min": 0,
        "max": 12,
        "step": 1,
        "value": 0
      }
    ]
  ,
    conceptLinks: []
},
  "sudoku-constraints": {
    "title": "Mini sudoku",
    "controls": [
      {
        "label": "Pistas conservadas",
        "min": 0,
        "max": 16,
        "step": 1,
        "value": 6
      },
      {
        "label": "Desplazamiento de selección",
        "min": 0,
        "max": 15,
        "step": 1,
        "value": 0
      }
    ]
  ,
    conceptLinks: []
},
  "euler-hamilton": {
    "title": "Aristas y visitas",
    "controls": [
      {
        "label": "Vértices",
        "min": 3,
        "max": 8,
        "step": 1,
        "value": 4
      },
      {
        "label": "Eliminar una arista",
        "min": 0,
        "max": 1,
        "step": 1,
        "value": 0
      }
    ]
  ,
    conceptLinks: [{"term":"grafo","route":"/articles/graph-foundations"}]
},
  "spherical-trigonometry": {
    "title": "Distancia sobre una esfera",
    "controls": [
      {
        "label": "Latitud destino",
        "min": -80,
        "max": 80,
        "step": 1,
        "value": 40
      },
      {
        "label": "Diferencia de longitud",
        "min": 0,
        "max": 180,
        "step": 1,
        "value": 90
      }
    ]
  ,
    conceptLinks: []
},
  "equation-of-time": {
    "title": "Tiempo solar y civil",
    "controls": [
      {
        "label": "Día del año",
        "min": 1,
        "max": 365,
        "step": 1,
        "value": 80
      },
      {
        "label": "Longitud (este positiva)",
        "min": -30,
        "max": 30,
        "step": 0.1,
        "value": -3.7
      }
    ]
  ,
    conceptLinks: []
},
  "daylight-saving-time": {
    "title": "Cambios de hora en Madrid",
    "controls": [
      {
        "label": "Minutos desde medianoche UTC",
        "min": 0,
        "max": 240,
        "step": 15,
        "value": 0
      },
      {
        "label": "Primavera 0, otoño 1",
        "min": 0,
        "max": 1,
        "step": 1,
        "value": 1
      }
    ]
  ,
    conceptLinks: []
},
  "dimensional-analysis": {
    "title": "Leyes de escala",
    "controls": [
      {
        "label": "Factor de escala",
        "min": 0.2,
        "max": 5,
        "step": 0.1,
        "value": 2
      },
      {
        "label": "Dimensión de la medida",
        "min": 1,
        "max": 3,
        "step": 1,
        "value": 3
      }
    ]
  ,
    conceptLinks: []
},
  "cardinality-diagonal": {
    "title": "Diagonal distinta",
    "controls": [
      {
        "label": "Filas mostradas",
        "min": 3,
        "max": 12,
        "step": 1,
        "value": 6
      },
      {
        "label": "Semilla de la lista",
        "min": 1,
        "max": 20,
        "step": 1,
        "value": 3
      }
    ]
  ,
    conceptLinks: []
},
  "cantor-function": {
    "title": "Escalera de Cantor",
    "controls": [
      {
        "label": "Iteraciones",
        "min": 1,
        "max": 7,
        "step": 1,
        "value": 4
      },
      {
        "label": "Punto",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "value": 0.5
      }
    ]
  ,
    conceptLinks: []
},
  "compact-perfect-disconnected": {
    "title": "Conjunto de Cantor",
    "controls": [
      {
        "label": "Iteraciones",
        "min": 0,
        "max": 7,
        "step": 1,
        "value": 4
      },
      {
        "label": "Punto explorado",
        "min": 0,
        "max": 1,
        "step": 0.01,
        "value": 0.33
      }
    ]
  ,
    conceptLinks: []
}
};
const fmt = (x: number) => Number.isFinite(x) ? Number(x.toPrecision(6)).toString() : 'no definido';
const factorial = (n: number): number => { let r = 1; for (let i = 2; i <= n; i++)
    r *= i; return r; };
export const choose = (n: number, k: number): number => { if (k < 0 || k > n)
    return 0; k = Math.min(k, n - k); let value = 1; for (let j = 1; j <= k; j++)
    value *= (n - k + j) / j; return value; };
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
function random(seed: number): () => number { let s = seed >>> 0; return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return (s + .5) / 4294967296; }; }
const normal = (x: number) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
export function normalCdf(x: number): number { const a = Math.abs(x), t = 1 / (1 + .2316419 * a), v = 1 - normal(a) * t * (.319381530 + t * (-.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))); return x < 0 ? 1 - v : v; }
export function logGamma(z: number): number { const c = [676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -.13857109526572012, 9.984369578019572e-6, 1.5056327351493116e-7]; if (z < .5)
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z); z -= 1; let x = .99999999999980993; c.forEach((v, i) => x += v / (z + i + 1)); const t = z + 7.5; return .5 * Math.log(2 * Math.PI) + (z + .5) * Math.log(t) - t + Math.log(x); }
export const studentDensity = (x: number, v: number) => Math.exp(logGamma((v + 1) / 2) - logGamma(v / 2)) / Math.sqrt(v * Math.PI) * Math.pow(1 + x * x / v, -(v + 1) / 2);
export const chiDensity = (x: number, v: number) => x <= 0 ? 0 : Math.exp((v / 2 - 1) * Math.log(x) - x / 2 - v / 2 * Math.log(2) - logGamma(v / 2));
export function binomialCdf(k: number, n: number, p: number): number { if (k < 0)
    return 0; if (p === 0)
    return 1; if (p === 1)
    return k >= n ? 1 : 0; let sum = 0; for (let j = 0; j <= Math.min(k, n); j++)
    sum += choose(n, j) * p ** j * (1 - p) ** (n - j); return Math.min(1, sum); }
export function proportionIntervals(k: number, n: number): {
    wilson: [
        number,
        number
    ];
    exact: [
        number,
        number
    ];
} { const z = 1.959963984540054, p = k / n, d = 1 + z * z / n, c = (p + z * z / 2 / n) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / 4 / n / n) / d; const root = (target: number, index: number) => { let lo = 0, hi = 1; for (let j = 0; j < 60; j++) {
    const mid = (lo + hi) / 2;
    if (binomialCdf(index, n, mid) > target)
        lo = mid;
    else
        hi = mid;
} return (lo + hi) / 2; }; return { wilson: [c - h, c + h], exact: [k === 0 ? 0 : root(.975, k - 1), k === n ? 1 : root(.025, k)] }; }
export function cantorValue(x: number, depth: number): number { let value = 0, weight = .5; for (let j = 0; j < depth; j++) {
    if (x < 1 / 3)
        x *= 3;
    else if (x > 2 / 3) {
        value += weight;
        x = 3 * x - 2;
    }
    else
        return value + weight;
    weight /= 2;
} return value + 2 * weight * x; }
export function sudokuSolutions(): number[][] { const all: number[][] = [], board = Array(16).fill(0); const visit = (i: number) => { if (i === 16) {
    all.push([...board]);
    return;
} const r = Math.floor(i / 4), c = i % 4; for (let v = 1; v <= 4; v++) {
    let ok = true;
    for (let j = 0; j < i; j++) {
        const rr = Math.floor(j / 4), cc = j % 4;
        if (board[j] === v && (rr === r || cc === c || (Math.floor(rr / 2) === Math.floor(r / 2) && Math.floor(cc / 2) === Math.floor(c / 2))))
            ok = false;
    }
    if (ok) {
        board[i] = v;
        visit(i + 1);
    }
} }; visit(0); return all; }
const miniSudokus = sudokuSolutions();
export function explorerResult(topic: string, a: number, b: number, seed = 1): ExplorerResult {
    const result: ExplorerResult = { series: [], rows: [], explanation: '', xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
    const row = (label: string, value: number | string) => result.rows.push([label, typeof value === 'number' ? fmt(value) : value]);
    const line = (label: string, f: (x: number) => number, lo: number, hi: number, count = 160) => { const points: [
        number,
        number
    ][] = Array.from({ length: count + 1 }, (_, i) => { const x = lo + (hi - lo) * i / count; return [x, f(x)]; }); result.series.push({ label, points }); };
    const points = (label: string, p: [
        number,
        number
    ][], kind: 'line' | 'bars' = 'line') => result.series.push({ label, points: p, kind });
    const rng = random(topic === 'cardinality-diagonal' ? b : seed);
    switch (topic) {
        case 'counting-principles': {
            const ordered = (k: number) => k <= a ? factorial(a) / factorial(a - k) : 0;
            points('Ordenadas', Array.from({ length: b + 1 }, (_, k) => [k, ordered(k)]));
            points('Sin orden', Array.from({ length: b + 1 }, (_, k) => [k, choose(a, k)]));
            row('Con repetición y orden', a ** b);
            row('Sin repetición y orden', ordered(b));
            row('Sin orden ni repetición', choose(a, b));
            row('Elementos elegidos', b);
            result.explanation = 'Elegir más elementos que los disponibles produce cero resultados sin repetición. Con repetición, cada posición sigue admitiendo todas las opciones.';
            break;
        }
        case 'inclusion-exclusion': {
            const overlap = Math.min(a, b) * .5;
            points('Cardinalidades', [[0, a], [1, b], [2, overlap], [3, a + b - overlap]], 'bars');
            row('Intersección (mitad del menor)', overlap);
            row('Unión', a + b - overlap);
            row('Suma ingenua', a + b);
            result.explanation = 'Las barras son A, B, intersección y unión. El solapamiento se fija en la mitad del conjunto menor; el modelo admite medidas fraccionarias.';
            break;
        }
        case 'mathematical-induction': {
            const p: [
                number,
                number
            ][] = [];
            let sum = 0;
            for (let k = 1; k <= a; k++) {
                sum += k ** b;
                p.push([k, sum]);
            }
            points('Suma directa', p);
            row('Suma directa', sum);
            row('Fórmula cerrada', b === 1 ? a * (a + 1) / 2 : b === 2 ? a * (a + 1) * (2 * a + 1) / 6 : (a * (a + 1) / 2) ** 2);
            result.explanation = 'La coincidencia finita sirve para descubrir identidades; la prueba inductiva cubre todos los índices.';
            break;
        }
        case 'rational-root-theorem': {
            const candidates = new Set<number>();
            for (let p = 1; p <= b; p++)
                if (b % p === 0)
                    for (let q = 1; q <= a; q++)
                        if (a % q === 0) {
                            candidates.add(p / q);
                            candidates.add(-p / q);
                        }
            const f = (x: number) => a * x ** 3 - x - b;
            line('Polinomio cúbico', f, -3, 3);
            row('Candidatos', Array.from(candidates).sort((x, y) => x - y).map(fmt).join(', '));
            row('Raíces racionales verificadas', Array.from(candidates).filter(x => Math.abs(f(x)) < 1e-9).map(fmt).join(', ') || 'ninguna');
            result.explanation = 'Los divisores dan candidatos, no raíces garantizadas. Se evalúa el polinomio del gráfico.';
            break;
        }
        case 'sign-charts': {
            line('Producto de factores', x => (x - a) ** b * (x + 2), -4, 4);
            row('Raíces', a === -2 ? '-2 (factores coincidentes)' : '-2, ' + fmt(a));
            row('Cambio de signo en raíz variable', (a === -2 ? b + 1 : b) % 2 ? 'sí' : 'no');
            result.explanation = 'Cuando los factores coinciden sus multiplicidades se suman. Una raíz par no cambia el signo.';
            break;
        }
        case 'polynomial-interpolation': {
            const n = a, f = (x: number) => 1 / (1 + 25 * x * x), nodes = Array.from({ length: n + 1 }, (_, i) => -1 + 2 * i / n), cn = Array.from({ length: n + 1 }, (_, i) => Math.cos((2 * i + 1) * Math.PI / (2 * (n + 1)))), interp = (ns: number[], x: number) => ns.reduce((s, xi, i) => s + f(xi) * ns.reduce((v, xj, j) => i === j ? v : v * (x - xj) / (xi - xj), 1), 0);
            line('Función de Runge', f, -1, 1);
            line('Nodos equiespaciados', x => interp(nodes, x), -1, 1);
            line('Nodos de Chebyshev', x => interp(cn, x), -1, 1);
            row('Valor real', f(b));
            row('Error equiespaciado', Math.abs(interp(nodes, b) - f(b)));
            row('Error Chebyshev', Math.abs(interp(cn, b) - f(b)));
            result.explanation = 'Polinomios del mismo grado y sin extrapolación. El error puntual no equivale al máximo del intervalo.';
            break;
        }
        case 'vector-spaces': {
            points('Imagen del círculo unitario', Array.from({ length: 161 }, (_, i) => { const t = 2 * Math.PI * i / 160; return [Math.cos(t) + Math.sin(t), a * Math.sin(t)]; }));
            row('Matriz', '[1, 1; 0, parámetro]');
            row('Rango', a === 0 ? 1 : 2);
            row('Dimensión del núcleo', a === 0 ? 1 : 0);
            row('Imagen de (1, coordenada)', '(' + fmt(1 + b) + ', ' + fmt(a * b) + ')');
            result.explanation = 'El rango exacto cambia en cero. Una matriz casi singular conserva rango dos aunque esté mal condicionada.';
            break;
        }
        case 'gram-schmidt': {
            points('Primer vector', [[0, 0], [1, 1]]);
            points('Segundo vector', [[0, 0], [b, b * (1 + a)]]);
            points('Resto ortogonal', [[0, 0], [-b * a / 2, b * a / 2]]);
            row('Norma del resto', b * a / Math.sqrt(2));
            row('Producto interno con primero', 0);
            row('Segunda dirección', a === 0 ? 'no existe: dependencia' : '(-1, 1) / raíz de 2');
            result.explanation = 'Un resto nulo indica dependencia; no puede normalizarse. La escala modifica la longitud, no la dirección.';
            break;
        }
        case 'projection-least-squares': {
            points('Observaciones unidas', [[-1, -a], [0, b], [1, a]]);
            line('Recta ajustada', x => a * x + b / 3, -1.5, 1.5);
            row('Pendiente', a);
            row('Intercepto', b / 3);
            row('Suma de residuos', 0);
            row('Suma de cuadrados', 2 * b * b / 3);
            result.explanation = 'La simetría permite calcular exactamente la proyección. Las líneas entre observaciones solo facilitan localizarlas.';
            break;
        }
        case 'pythagorean-distance': {
            points('Catetos', [[0, 0], [a, 0], [a, b]]);
            points('Hipotenusa', [[0, 0], [a, b]]);
            row('Distancia', Math.hypot(a, b));
            row('Distancia al cuadrado', a * a + b * b);
            row('Norma Manhattan', a + b);
            result.explanation = 'Manhattan usa otra geometría. Los ejes del laboratorio usan una escala geométrica común.';
            break;
        }
        case 'triangle-similarity': {
            points('Original', [[0, 0], [b, 0], [0, b / 2], [0, 0]]);
            points('Escalado', [[0, 0], [a * b, 0], [0, a * b / 2], [0, 0]]);
            row('Razón de perímetros', a);
            row('Razón de áreas', a * a);
            row('Área escalada', a * a * b * b / 4);
            result.explanation = 'La homotecia tiene centro en el origen. Las longitudes y las áreas cambian con exponentes distintos.';
            break;
        }
        case 'sine-law': {
            const rawSine = 6 * Math.sin(a * Math.PI / 180) / b;
            // Arcsine amplifies rounding near one; merge the tangent branches first.
            const s = Math.abs(rawSine - 1) <= 1e-12 ? 1 : rawSine;
            const B = s <= 1 ? Math.asin(s) * 180 / Math.PI : NaN;
            const candidates = s === 1 ? [B] : [B, 180 - B];
            const valid = candidates.filter(v => Number.isFinite(v) && a + v < 180);
            row('Lado b fijo', 6);
            row('Seno requerido de B', s);
            row('Triángulos posibles', valid.length);
            valid.forEach((v, i) => row('Ángulo B, solución ' + (i + 1), fmt(v) + ' grados'));
            line('Seno de B', x => Math.sin(x * Math.PI / 180), 0, 180);
            line('Valor requerido', () => s, 0, 180);
            result.explanation = 'Se exige también suma angular menor que 180 grados. La solución tangente cuenta una sola vez.';
            break;
        }
        case 'complex-arithmetic': {
            const z: [
                number,
                number
            ] = [(2 * a + b) / 5, (2 * b - a) / 5];
            points('Dividendo', [[0, 0], [a, b]]);
            points('Divisor 2+i', [[0, 0], [2, 1]]);
            points('Cociente', [[0, 0], z]);
            row('Cociente', fmt(z[0]) + ' + (' + fmt(z[1]) + ') i');
            row('Módulo del dividendo', Math.hypot(a, b));
            row('Módulo del cociente', Math.hypot(...z));
            result.explanation = 'Dividir por 2+i rota y reduce la longitud por raíz de cinco. El divisor no puede anularse en este modelo.';
            break;
        }
        case 'geometric-series': {
            let sum = 0;
            const p: [
                number,
                number
            ][] = [];
            for (let k = 0; k < b; k++) {
                sum += a ** k;
                p.push([k + 1, sum]);
            }
            points('Suma parcial', p);
            if (Math.abs(a) < 1)
                line('Límite', () => 1 / (1 - a), 1, b);
            row('Suma finita', sum);
            row('Resto exacto', Math.abs(a) < 1 ? a ** b / (1 - a) : 'serie infinita divergente');
            result.explanation = 'Una suma finita existe aunque la serie infinita diverja. Una razón negativa alterna alrededor del límite.';
            break;
        }
        case 'positive-series-tests': {
            let sum = 0;
            const p: [
                number,
                number
            ][] = [];
            for (let k = 1; k <= b; k++) {
                sum += k ** (-a);
                p.push([k, sum]);
            }
            points('Suma parcial', p);
            row('Clasificación', a > 1 ? 'convergente' : 'divergente');
            row('Suma parcial', sum);
            row('Cota superior del resto', a > 1 ? b ** (1 - a) / (a - 1) : 'no hay resto finito');
            result.explanation = 'Una gráfica aparentemente plana no demuestra convergencia. La cota integral solo garantiza resto finito para exponente mayor que uno.';
            break;
        }
        case 'lhopital-rule': {
            const f = (x: number) => (Math.exp(x) - Array.from({ length: b }, (_, k) => x ** k / factorial(k)).reduce((s, v) => s + v, 0)) / x ** b;
            line('Cociente directo', f, .0001, .1);
            line('Límite teórico', () => 1 / factorial(b), .0001, .1);
            row('Evaluación directa', f(a));
            row('Límite', 1 / factorial(b));
            result.explanation = 'El numerador es un resto de Taylor. La resta directa pierde precisión cerca de cero: el fallo numérico no invalida el límite.';
            break;
        }
        case 'linear-approximation': {
            const f = (x: number) => Math.sqrt(x), df = 1 / (2 * Math.sqrt(a));
            line('Raíz cuadrada', f, Math.max(.05, a - .5), a + .5);
            line('Tangente', x => f(a) + df * (x - a), Math.max(.05, a - .5), a + .5);
            row('Valor exacto', f(a + b));
            row('Valor lineal', f(a) + df * b);
            row('Error real', f(a + b) - f(a) - df * b);
            result.explanation = 'La raíz es cóncava: su tangente queda por encima. Para incrementos pequeños el error es de segundo orden.';
            break;
        }
        case 'banach-fixed-point': {
            let x = b;
            const p: [
                number,
                number
            ][] = [[0, x]];
            for (let k = 1; k <= 20; k++) {
                x = a * x + 1 - a;
                p.push([k, x]);
            }
            points('Iterados', p);
            line('Punto fijo', () => 1, 0, 20);
            row('Iterado 20', x);
            row('Cota del error', Math.abs(a) ** 20 * Math.abs(b - 1));
            row('Constante Lipschitz', Math.abs(a));
            result.explanation = 'El mapa afín conserva la recta real completa. Una pendiente negativa provoca alternancia.';
            break;
        }
        case 'numerical-conditioning': {
            const x = 10 ** a, raw = Math.sqrt(x * x + 1) - x, stable = 1 / (Math.sqrt(x * x + 1) + x);
            points('Dígitos conservados por resta', Array.from({ length: 15 }, (_, i) => { const v = 10 ** (i + 2), ref = 1 / (Math.sqrt(v * v + 1) + v), r = Math.sqrt(v * v + 1) - v; return [i + 2, r === 0 ? 0 : Math.max(0, -Math.log10(Math.abs((r - ref) / ref) || Number.EPSILON))]; }));
            row('Resta directa', raw);
            row('Racionalización', stable);
            row('Error relativo', Math.abs((raw - stable) / stable));
            row('Respuesta relativa a perturbación', Math.abs((1 / (Math.sqrt((x * (1 + b)) ** 2 + 1) + x * (1 + b)) - stable) / stable));
            result.explanation = 'Aritmética de doble precisión. La racionalización evita cancelación; no proporciona precisión arbitraria.';
            break;
        }
        case 'ode-numerical-integration': {
            const n = Math.ceil(b / a), h = b / n;
            for (const [name, m] of [['Euler', 0], ['Heun', 1], ['RK4', 2]] as const) {
                let y = 1;
                const p: [
                    number,
                    number
                ][] = [[0, y]];
                for (let k = 1; k <= n; k++) {
                    const k1 = -y, k2 = -(y + h * k1 / 2), k3 = -(y + h * k2 / 2), k4 = -(y + h * k3);
                    y += m === 0 ? h * k1 : m === 1 ? h * (k1 - (y + h * k1)) / 2 : h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
                    p.push([k * h, y]);
                }
                points(name, p);
                row('Error final ' + name, Math.abs(y - Math.exp(-b)));
            }
            line('Solución exacta', x => Math.exp(-x), 0, b);
            row('Paso efectivo', h);
            result.explanation = 'Problema y prima = -y, con valor inicial uno. Se ajusta el paso para llegar al tiempo final. Este ensayo no representa ecuaciones rígidas.';
            break;
        }
        case 'large-numbers-law': {
            let sum = 0;
            const p: [
                number,
                number
            ][] = [];
            for (let k = 1; k <= b; k++) {
                sum += rng() < a ? 1 : 0;
                p.push([k, sum / k]);
            }
            points('Media acumulada', p);
            line('Probabilidad real', () => a, 1, b);
            row('Media final', sum / b);
            row('Error final', sum / b - a);
            row('Desviación de la media', Math.sqrt(a * (1 - a) / b));
            result.explanation = 'La ley no promete mejora monótona ni compensación de rachas.';
            break;
        }
        case 'probability-inequalities': {
            const lo = Math.ceil(b * (.5 - a)), hi = Math.floor(b * (.5 + a));
            line('Chebyshev', e => Math.min(1, .25 / b / e / e), .02, .5);
            line('Hoeffding', e => Math.min(1, 2 * Math.exp(-2 * b * e * e)), .02, .5);
            row('Cola binomial fuera de banda cerrada', binomialCdf(lo - 1, b, .5) + 1 - binomialCdf(hi, b, .5));
            row('Chebyshev', Math.min(1, .25 / b / a / a));
            row('Markov para media ≥ 0.5 + epsilon', .5 / (.5 + a));
            result.explanation = 'Modelo Bernoulli independiente con probabilidad un medio. Cada cota usa hipótesis distintas.';
            break;
        }
        case 'covariance': {
            line('Varianza de suma', x => 1 + b * b + 2 * x * b, -1, 1);
            row('Covarianza', a * b);
            row('Varianza de suma', 1 + b * b + 2 * a * b);
            row('Sin dependencia', 1 + b * b);
            result.explanation = 'Desviación de X igual a uno. Correlación cero no equivale en general a independencia.';
            break;
        }
        case 'student-chi-square': {
            line('t de Student', x => studentDensity(x, a), -5, 5);
            line('Normal estándar', normal, -5, 5);
            const scale = Math.sqrt(2 * a);
            line('Chi-cuadrado centrada y escalada', z => scale * chiDensity(a + z * scale, a), -5, 5);
            row('Densidad t', studentDensity(b, a));
            row('Densidad chi-cuadrado', chiDensity(b, a));
            row('Media chi-cuadrado', a);
            row('Varianza t', a > 2 ? a / (a - 2) : 'no existe');
            result.explanation = 'La chi-cuadrado se representa centrada en su media y dividida por su desviación para comparar formas. Sus lecturas numéricas usan la variable original. Una densidad puntual no es una probabilidad; con un grado la densidad crece sin límite en el extremo del soporte.';
            break;
        }
        case 'proportion-intervals': {
            const k = Math.round(a * b), v = proportionIntervals(k, a);
            row('Éxitos efectivos', k);
            row('Wilson 95%', v.wilson.map(fmt).join(' a '));
            row('Clopper–Pearson 95%', v.exact.map(fmt).join(' a '));
            points('Wilson', [[v.wilson[0], 1], [v.wilson[1], 1]]);
            points('Exacto', [[v.exact[0], .5], [v.exact[1], .5]]);
            result.xmin = 0;
            result.xmax = 1;
            result.ymin = 0;
            result.ymax = 1.5;
            result.explanation = 'Éxitos redondeados a entero. Clopper–Pearson invierte colas binomiales por bisección.';
            break;
        }
        case 'statistical-power': {
            const power = (d: number) => 1 - normalCdf(1.9599639845 - d * Math.sqrt(a)) + normalCdf(-1.9599639845 - d * Math.sqrt(a));
            line('Potencia bilateral normal', power, 0, 1);
            row('Nivel', .05);
            row('Potencia', power(b));
            row('Error tipo II', 1 - power(b));
            result.explanation = 'Media normal con sigma conocida. Aproximación normal de error inferior a una millonésima.';
            break;
        }
        case 'bootstrap': {
            const sample = [1, 2, 2, 3, 4, 5, 6, b], means: number[] = [];
            for (let k = 0; k < a; k++) {
                let s = 0;
                for (let j = 0; j < 8; j++)
                    s += sample[Math.floor(rng() * 8)];
                means.push(s / 8);
            }
            means.sort((x, y) => x - y);
            const bootMean = means.reduce((s, x) => s + x, 0) / a, bins = Array(20).fill(0), hi = Math.max(...means) + .01;
            means.forEach(x => bins[Math.min(19, Math.floor(x / hi * 20))]++);
            points('Medias remuestreadas', bins.map((v, i) => [(i + .5) * hi / 20, v / a]), 'bars');
            row('Media original', sample.reduce((s, x) => s + x, 0) / 8);
            row('Percentiles bootstrap 95%', fmt(means[Math.floor(.025 * a)]) + ' a ' + fmt(means[Math.min(a - 1, Math.floor(.975 * a))]));
            row('Error estándar bootstrap', Math.sqrt(means.reduce((s, x) => s + (x - bootMean) ** 2, 0) / (a - 1)));
            result.explanation = 'Ocho observaciones con reemplazo por réplica. Cambiar semilla modifica el error Monte Carlo, no la muestra poblacional.';
            break;
        }
        case 'causal-inference': {
            const treated = a * .9 + (1 - a) * .4, control = b * .95 + (1 - b) * .5;
            points('Tasas agregadas', [[0, treated], [1, control]], 'bars');
            row('Diferencia agregada', treated - control);
            row('Diferencia fáciles', -.05);
            row('Diferencia difíciles', -.1);
            row('Diferencia estandarizada 50/50', -.075);
            result.explanation = 'Inversión de Simpson por composición. Una lectura causal necesita supuestos adicionales.';
            break;
        }
        case 'stratified-sampling': {
            points('Estimaciones', [[0, a * 10 + (1 - a) * 30], [1, b * 10 + (1 - b) * 30]], 'bars');
            row('Media estrato 1', 10);
            row('Media estrato 2', 30);
            row('Ponderada', a * 10 + (1 - a) * 30);
            row('Ingenua', b * 10 + (1 - b) * 30);
            row('Razón de pesos individuales', a * (1 - b) / ((1 - a) * b));
            result.explanation = 'Medias de estrato fijas para aislar sesgo de composición; no corrige selección dentro de estratos.';
            break;
        }
        case 'burnside-lemma': {
            const fixed = Array.from({ length: a }, (_, k) => b ** gcd(a, k));
            points('Coloraciones fijas por giro', fixed.map((v, k) => [k, v]), 'bars');
            row('Coloraciones etiquetadas', b ** a);
            row('Órbitas rotacionales', fixed.reduce((s, x) => s + x, 0) / a);
            row('División ingenua', b ** a / a);
            result.explanation = 'Solo rotaciones, no reflejos. La simetría interna acorta órbitas.';
            break;
        }
        case 'rubik-invariants': {
            row('Giros módulo 3', a % 3);
            row('Volteos módulo 2', b % 2);
            row('Paridades asumidas', 'ambas pares');
            row('Admisible', a % 3 === 0 && b % 2 === 0 ? 'sí' : 'no');
            points('Restos', [[0, a % 3], [1, b % 2]], 'bars');
            result.explanation = 'Se modelan sumas de orientaciones con paridades iguales, no movimientos físicos.';
            break;
        }
        case 'sudoku-constraints': {
            const target = miniSudokus[0], indices = Array.from({ length: a }, (_, i) => (i + b) % 16), compatible = miniSudokus.filter(board => indices.every(i => board[i] === target[i]));
            result.cells = Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => indices.includes(4 * r + c) ? String(target[4 * r + c]) : '·'));
            row('Soluciones compatibles', compatible.length);
            row('Solución única', compatible.length === 1 ? 'sí' : 'no');
            row('Restricciones exactas', 64);
            row('Candidatos', 64);
            result.explanation = 'Enumeración de las 288 soluciones del sudoku 4×4 con bloques 2×2. Las pistas son válidas pero no garantizan unicidad.';
            break;
        }
        case 'euler-hamilton': {
            const edges: [
                number,
                number
            ][] = [];
            for (let i = 0; i < a; i++)
                for (let j = i + 1; j < a; j++)
                    if (!(b && i === 0 && j === 1))
                        edges.push([i, j]);
            const degree = Array.from({ length: a }, (_, i) => edges.filter(e => e.includes(i)).length), odd = degree.filter(d => d % 2).length;
            edges.forEach(([i, j]) => points('Arista ' + i + '-' + j, [[Math.cos(2 * Math.PI * i / a), Math.sin(2 * Math.PI * i / a)], [Math.cos(2 * Math.PI * j / a), Math.sin(2 * Math.PI * j / a)]]));
            row('Grados impares', odd);
            row('Recorrido euleriano', odd === 0 ? 'circuito' : odd === 2 ? 'camino abierto' : 'no existe');
            row('Ciclo hamiltoniano', a === 3 && b ? 'no' : 'sí');
            result.explanation = 'Grafo completo conectado, opcionalmente sin una arista. Camino y ciclo hamiltonianos son propiedades distintas.';
            break;
        }
        case 'spherical-trigonometry': {
            const phi = a * Math.PI / 180, angle = Math.acos(Math.max(-1, Math.min(1, Math.cos(phi) * Math.cos(b * Math.PI / 180))));
            line('Distancia angular según longitud', x => Math.acos(Math.max(-1, Math.min(1, Math.cos(phi) * Math.cos(x * Math.PI / 180)))) * 180 / Math.PI, 0, 180);
            row('Origen', 'latitud 0°, longitud 0°');
            row('Separación, grados', angle * 180 / Math.PI);
            row('Distancia con radio 6371 km', 6371 * angle);
            result.explanation = 'Esfera ideal sin achatamiento, refracción ni altitud.';
            break;
        }
        case 'equation-of-time': {
            const e = (day: number) => { const B = 2 * Math.PI * (day - 81) / 364; return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B); };
            line('Ecuación del tiempo aproximada, min', e, 1, 365);
            row('Ecuación del tiempo', e(a));
            row('Mediodía UTC, minutos desde 12:00', -4 * b - e(a));
            row('Mediodía civil UTC+1, minutos desde 12:00', 60 - 4 * b - e(a));
            result.explanation = 'Convención: aparente menos medio. Aproximación anual; el horario de verano suma otra hora civil.';
            break;
        }
        case 'daylight-saving-time': {
            const base = Date.parse(b ? '2026-10-25T00:00:00Z' : '2026-03-29T00:00:00Z'), format = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
            result.cells = Array.from({ length: 9 }, (_, i) => [new Date(base + i * 30 * 60000).toISOString().slice(11, 16) + ' UTC', format.format(base + i * 30 * 60000)]);
            row('UTC seleccionado', new Date(base + a * 60000).toISOString());
            row('Hora Europe/Madrid', format.format(base + a * 60000));
            result.explanation = 'Reglas IANA del navegador para fechas de 2026: en otoño hay una hora repetida y en primavera un salto. Las reglas futuras pueden cambiar.';
            break;
        }
        case 'dimensional-analysis': {
            line('Longitud', x => x, .2, 5);
            line('Área', x => x * x, .2, 5);
            line('Volumen', x => x * x * x, .2, 5);
            row('Factor de medida', a ** b);
            row('Superficie / volumen', 1 / a);
            row('Periodo orbital, masa fija', a ** 1.5);
            result.explanation = 'Figuras semejantes; el periodo supone gravitación newtoniana y masa central fija.';
            break;
        }
        case 'cardinality-diagonal': {
            const bits = Array.from({ length: a }, () => Array.from({ length: a }, () => rng() < .5 ? '0' : '2')), diag = bits.map((r, i) => r[i] === '0' ? '2' : '0');
            result.cells = bits.map((r, i) => [String(i + 1), r.map((v, j) => j === i ? '[' + v + ']' : v).join(' ')]);
            row('Nueva fila ternaria', diag.join(' '));
            row('Diferencia con cada fila', 'en la cifra de su propio índice');
            result.explanation = 'La tabla finita ilustra una prueba infinita. Las cifras ternarias cero y dos evitan el problema de las representaciones decimales dobles.';
            break;
        }
        case 'cantor-function': {
            line('Escalera aproximada', x => cantorValue(x, a), 0, 1, 729);
            line('Uniforme', x => x, 0, 1);
            row('Valor aproximado', cantorValue(b, a));
            row('Masa por intervalo', 2 ** (-a));
            row('Longitud total', (2 / 3) ** a);
            result.explanation = 'Aproximación continua y lineal en los intervalos supervivientes; el límite es singular.';
            break;
        }
        case 'compact-perfect-disconnected': {
            let intervals: [
                number,
                number
            ][] = [[0, 1]];
            for (let k = 0; k < a; k++)
                intervals = intervals.flatMap(([l, r]) => [[l, l + (r - l) / 3], [r - (r - l) / 3, r]] as [
                    number,
                    number
                ][]);
            intervals.forEach((v, i) => points('Intervalo ' + i, [[v[0], 0], [v[1], 0]]));
            row('Intervalos', intervals.length);
            row('Longitud total', (2 / 3) ** a);
            row('Punto en etapa finita', intervals.some(([l, r]) => b >= l && b <= r) ? 'sí' : 'no');
            row('Distancia a etapa', Math.min(...intervals.map(([l, r]) => b < l ? l - b : b > r ? b - r : 0)));
            result.explanation = 'Pertenecer a una etapa no garantiza pertenecer al límite: debe sobrevivirse a todas las etapas.';
            break;
        }
    }
    if (topic !== 'proportion-intervals') {
        const all = result.series.flatMap(s => s.points).filter(p => p.every(Number.isFinite));
        if (all.length) {
            const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
            result.xmin = Math.min(...xs);
            result.xmax = Math.max(...xs);
            result.ymin = Math.min(0, ...ys);
            result.ymax = Math.max(...ys);
            const dy = result.ymax - result.ymin || 1, dx = result.xmax - result.xmin || 1;
            result.ymin -= dy * .08;
            result.ymax += dy * .12;
            result.xmin -= dx * .02;
            result.xmax += dx * .02;
        }
    }
    return result;
}
