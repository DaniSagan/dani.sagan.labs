import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Matrix } from '../../shared/math/determinant';
import {
  diagonalization,
  ExactMatrix,
  matricesEqual,
  matrixTex,
  powerExact,
  productExact,
  Quadratic,
  rationalSpectrum,
  scalar,
  Spectrum,
  spectrum2,
} from '../../shared/math/diagonalization';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import { MatrixInputComponent } from '../determinant/matrix-input.component';
import { EigenPlaneComponent } from './eigen-plane.component';

type Mode = 'explorer' | 'algebra' | 'basis' | 'spectral' | 'powers';
@Component({
  selector: 'app-diagonalization-lab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormulaComponent,
    MatrixInputComponent,
    EigenPlaneComponent,
  ],
  templateUrl: './diagonalization-lab.component.html',
  styleUrl: './diagonalization-lab.component.css',
})
export class DiagonalizationLabComponent {
  @Input() mode: Mode = 'explorer';
  matrix: Matrix = [
    [2, 1],
    [1, 2],
  ];
  spectrum: Spectrum = spectrum2(this.matrix);
  vector = [1, 0];
  showDirections = false;
  reverse = false;
  step = 0;
  exponent = 4;
  stage = 0;
  angle = 0;
  error = '';
  selected = 'symmetric';
  readonly titles: Record<Mode, string> = {
    explorer: 'Descubre las direcciones que no giran',
    algebra: 'Del determinante a los autoespacios',
    basis: 'Construye la base y recorre las coordenadas',
    spectral: 'Ejes ortogonales y escalados independientes',
    powers: 'Itera la transformación: ¿qué dirección domina?',
  };
  readonly presets = [
    {
      id: 'symmetric',
      name: 'Simétrica',
      a: [
        [2, 1],
        [1, 2],
      ],
      text: 'Estira tres veces la diagonal y deja fija la antidiagonal.',
    },
    {
      id: 'distinct',
      name: 'Dos autovalores distintos',
      a: [
        [2, 1],
        [0, 1],
      ],
      text: 'Dos rectas propias oblicuas: diagonalizable sin una base ortogonal.',
    },
    {
      id: 'diagonal',
      name: 'Diagonal',
      a: [
        [2, 0],
        [0, 0.5],
      ],
      text: 'Los ejes estándar ya son direcciones propias.',
    },
    {
      id: 'identity',
      name: 'Identidad: autovalor repetido',
      a: [
        [1, 0],
        [0, 1],
      ],
      text: 'Toda dirección es propia. Un solo autovalor y un autoespacio de dimensión dos.',
    },
    {
      id: 'jordan',
      name: 'Jordan / cizallamiento',
      a: [
        [1, 1],
        [0, 1],
      ],
      text: 'Solo la recta horizontal es propia: falta una segunda dirección independiente.',
    },
    {
      id: 'rotation',
      name: 'Rotación de 90°',
      a: [
        [0, -1],
        [1, 0],
      ],
      text: 'Ninguna recta real es propia. Sobre los complejos aparecen i y −i.',
    },
    {
      id: 'projection',
      name: 'Proyección',
      a: [
        [1, 0],
        [0, 0],
      ],
      text: 'El eje vertical colapsa al origen (λ = 0); el horizontal queda fijo.',
    },
    {
      id: 'reflection',
      name: 'Reflexión',
      a: [
        [1, 0],
        [0, -1],
      ],
      text: 'El eje horizontal queda fijo; el vertical cambia de sentido.',
    },
    {
      id: 'contraction',
      name: 'Contracción con alternancia',
      a: [
        [0.5, 0],
        [0, -0.75],
      ],
      text: 'Ambas componentes tienden a cero; la vertical alterna su signo.',
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci',
      a: [
        [1, 1],
        [1, 0],
      ],
      text: 'Dos autovalores irracionales: φ domina y ψ alterna mientras se amortigua.',
    },
  ];
  readonly examples3 = [
    {
      name: '3D: repetido diagonalizable',
      a: [
        [2, 0, 0],
        [0, 2, 0],
        [0, 0, -1],
      ],
      roots: [2, 2, -1],
    },
    {
      name: '3D: bloque de Jordan',
      a: [
        [2, 1, 0],
        [0, 2, 0],
        [0, 0, -1],
      ],
      roots: [2, 2, -1],
    },
  ];
  choose(id: string) {
    const preset = this.presets.find((p) => p.id === id)!;
    this.selected = id;
    this.update(preset.a.map((row) => [...row]));
    this.step = 0;
  }
  update(a: Matrix) {
    this.matrix = a;
    this.error = '';
    if (
      a.some((row) => row.some((v) => !Number.isFinite(v) || Math.abs(v) > 5))
    ) {
      this.error = 'Introduce entradas finitas entre −5 y 5.';
      return;
    }
    try {
      this.spectrum = spectrum2(a);
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  choose3(index: number) {
    const e = this.examples3[index];
    this.matrix = e.a;
    this.spectrum = rationalSpectrum(e.a, e.roots);
    this.selected = '';
    this.step = 4;
    this.error = '';
  }
  get interpretation() {
    return (
      this.presets.find((p) => p.id === this.selected)?.text ||
      'Compara las dimensiones de los autoespacios con sus multiplicidades.'
    );
  }
  get decomposition() {
    return diagonalization(this.spectrum, this.reverse);
  }
  get realSpaces() {
    return this.spectrum.spaces.filter((s) => s.value.real);
  }
  get directions() {
    return this.showDirections
      ? this.realSpaces
          .flatMap((s) => s.basis)
          .map((v) => {
            const a = v.map((x) => x.approximate());
            const norm = Math.hypot(...a);
            return a.map((x) => x / norm);
          })
      : [];
  }
  get allDirections() {
    return (
      this.realSpaces.some((s) => s.geometric === 2) && this.matrix.length === 2
    );
  }
  setCoordinate(i: number, value: number) {
    if (Number.isFinite(value)) {
      this.vector = this.vector.map((v, j) =>
        i === j ? Math.max(-3, Math.min(3, value)) : v,
      );
    }
  }
  setAngle(value: number) {
    this.angle = value;
    this.vector = [
      Math.cos((value * Math.PI) / 180),
      Math.sin((value * Math.PI) / 180),
    ];
  }
  snap(index: number) {
    const v = this.realSpaces
      .flatMap((s) => s.basis)
      [index].map((x) => x.approximate());
    const norm = Math.hypot(...v);
    this.vector = v.map((x) => (2 * x) / norm);
  }
  get image() {
    return this.matrix
      .slice(0, 2)
      .map((row) => row[0] * this.vector[0] + row[1] * this.vector[1]);
  }
  get collinearity() {
    const [x, y] = this.vector,
      [u, v] = this.image,
      norm = Math.hypot(x, y),
      imageNorm = Math.hypot(u, v);
    if (norm < 1e-12)
      return 'El vector cero no es un autovector. Elige un vector no nulo.';
    const lambda = (x * u + y * v) / (norm * norm);
    if (imageNorm < 1e-12)
      return `Av ≈ 0: dirección del núcleo (a la precisión del dibujo).`;
    const residual = Math.abs(x * v - y * u) / (norm * imageNorm);
    return residual < 1e-10
      ? `Av ≈ (${this.fmt(lambda)})v: dirección propia a la precisión del dibujo.`
      : residual < 0.025
        ? `Casi colineales. Desviación normalizada: ${this.fmt(residual)}.`
        : `Cambian de dirección. Desviación normalizada: ${this.fmt(residual)}.`;
  }
  fmt(v: number) {
    return Number(v.toPrecision(5)).toLocaleString('es-ES', {
      maximumSignificantDigits: 5,
    });
  }
  tex = matrixTex;
  productForTemplate = productExact;
  get vectorMatrix() {
    return exactMatrixVector(this.vector);
  }
  texNumeric(a: Matrix) {
    return matrixTex(
      a.map((row) => row.map((v) => scalar(Number(v.toPrecision(5))))),
    );
  }
  vectorTex(v: import('../../shared/math/diagonalization').Quadratic[]) {
    return matrixTex(v.map((x) => [x]));
  }
  get polynomial() {
    const s = this.spectrum;
    return s.trace
      ? `p_A(t)=t^2-(${new Quadratic(s.trace).tex()})t+(${new Quadratic(s.determinant!).tex()})`
      : `p_A(t)=(2-t)^2(-1-t)`;
  }
  get shifted() {
    return `A-tI=\\begin{pmatrix}${this.matrix.map((row, i) => row.map((v, j) => `${scalar(v).tex()}${i === j ? '-t' : ''}`).join('&')).join('\\\\')}\\end{pmatrix}`;
  }
  get determinantExpansion() {
    const [[a, b], [c, d]] = this.matrix;
    return `\\det(A-tI)=(${scalar(a).tex()}-t)(${scalar(d).tex()}-t)-(${scalar(b).tex()})(${scalar(c).tex()})`;
  }
  get verified() {
    const x = this.decomposition;
    return (
      !!x &&
      matricesEqual(
        productExact(this.spectrum.matrix, x.p),
        productExact(x.p, x.d),
      ) &&
      matricesEqual(
        productExact(productExact(x.p, x.d), x.inverse),
        this.spectrum.matrix,
      )
    );
  }
  get stageData() {
    const x = this.decomposition!;
    const coordinates = productExact(x.inverse, exactMatrixVector(this.vector));
    const scaled = productExact(x.d, coordinates);
    const result = productExact(x.p, scaled);
    return [
      {
        title: '1. P⁻¹: coordenadas en la base propia',
        input: this.vector,
        matrix: x.inverse,
        output: coordinates,
      },
      {
        title: '2. D: escalado de cada coordenada',
        input: coordinates.map((row) => row[0].approximate()),
        matrix: x.d,
        output: scaled,
      },
      {
        title: '3. P: regreso a la base estándar',
        input: scaled.map((row) => row[0].approximate()),
        matrix: x.p,
        output: result,
      },
    ][this.stage];
  }
  numeric(a: ExactMatrix) {
    return a.map((row) => row.map((x) => x.approximate()));
  }
  get powered() {
    return powerExact(this.spectrum.matrix, this.exponent);
  }
  get spectralPower() {
    const x = this.decomposition!;
    return productExact(
      productExact(x.p, powerExact(x.d, this.exponent)),
      x.inverse,
    );
  }
  get powerVerified() {
    return matricesEqual(this.powered, this.spectralPower);
  }
  get orbit() {
    return Array.from({ length: Math.min(this.exponent, 20) + 1 }, (_, n) => {
      const v = productExact(
        powerExact(this.spectrum.matrix, n),
        exactMatrixVector(this.vector),
      ).map((row) => row[0].approximate());
      return { n, v };
    });
  }
  get orbitExtent() {
    return Math.max(1, ...this.orbit.flatMap((p) => p.v.map(Math.abs)));
  }
  get orbitPath() {
    return this.orbit
      .map(
        (p) =>
          `${260 + (p.v[0] * 230) / this.orbitExtent},${260 - (p.v[1] * 230) / this.orbitExtent}`,
      )
      .join(' ');
  }
  get symmetric() {
    return this.matrix.length === 2 && this.matrix[0][1] === this.matrix[1][0];
  }
  get orthogonal() {
    const x = this.decomposition!;
    const p = this.numeric(x.p);
    return p.map((row) =>
      row.map((v, j) => v / Math.hypot(...p.map((r) => r[j]))),
    );
  }
  get orthogonalStages() {
    const q = this.orthogonal,
      transpose = q[0].map((_, j) => q.map((row) => row[j]));
    const d = this.numeric(this.decomposition!.d),
      matrices = [transpose, d, q];
    const inputs = [this.vector];
    matrices
      .slice(0, 2)
      .forEach((a) =>
        inputs.push(
          a.map((row) =>
            row.reduce(
              (sum, v, j) => sum + v * inputs[inputs.length - 1][j],
              0,
            ),
          ),
        ),
      );
    return matrices.map((matrix, i) => ({
      matrix,
      vector: inputs[i],
      title: [
        'Qᵀ: expresar en los ejes propios',
        'D: escalar en los nuevos ejes',
        'Q: volver al plano original',
      ][i],
    }));
  }
}
function exactMatrixVector(vector: number[]): ExactMatrix {
  return vector.map((v) => [scalar(v)]);
}
