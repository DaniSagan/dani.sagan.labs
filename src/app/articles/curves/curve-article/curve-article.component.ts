import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { curveEquation } from '../curve-equations';
import { Vec2 } from 'src/app/shared/math/vec2';
import { GraphableFunction, ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';

type CurveParam = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
};

type CurveDefinition = {
  key: string;
  title: string;
  route: string;
  description: string;
  bounds: [number, number, number, number];
  kind: 'implicit' | 'parametric';
  params: CurveParam[];
  equation: (params: Record<string, number>) => string;
  fn?: (x: number, y: number, params: Record<string, number>) => number;
  paramX?: (t: number, params: Record<string, number>) => number;
  paramY?: (t: number, params: Record<string, number>) => number;
};

const CURVE_DEFINITIONS: CurveDefinition[] = [
  {
    key: 'cardioid',
    title: 'Cardioide',
    route: 'cardioid',
    description: 'Una cardioide es una curva con forma de corazón que aparece en mecánica y óptica. Su ecuación polar relaciona el radio y el ángulo.',
    bounds: [-4, 4, -3, 3],
    kind: 'implicit',
    params: [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1 }],
    equation: (params) => curveEquation('cardioid', params),
    fn: (x, y, params) => {
      const r = Math.hypot(x, y);
      const theta = Math.atan2(y, x);
      return r - params.a * (1 + Math.cos(theta));
    }
  },
  {
    key: 'rose',
    title: 'Rosa polar',
    route: 'rose',
    description: 'La rosa polar es una familia de curvas con pétalos simétricos, definidas mediante funciones trigonométricas del ángulo.',
    bounds: [-4, 4, -4, 4],
    kind: 'implicit',
    params: [
      { key: 'a', label: 'a', min: 0.5, max: 4, step: 0.1, value: 2 },
      { key: 'k', label: 'k', min: 1, max: 8, step: 1, value: 3 }
    ],
    equation: (params) => curveEquation('rose', params),
    fn: (x, y, params) => {
      const r = Math.hypot(x, y);
      const theta = Math.atan2(y, x);
      return r - params.a * Math.cos(params.k * theta);
    }
  },
  {
    key: 'lemniscate',
    title: 'Lemniscata',
    route: 'lemniscate',
    description: 'La lemniscata de Bernoulli tiene la forma de un ocho horizontal y se usa como ejemplo clásico de curva algebraica.',
    bounds: [-4, 4, -3, 3],
    kind: 'implicit',
    params: [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }],
    equation: (params) => curveEquation('lemniscate', params),
    fn: (x, y, params) => (x * x + y * y) ** 2 - 2 * params.a * params.a * (x * x - y * y)
  },
  {
    key: 'cassini',
    title: 'Óvalos de Cassini',
    route: 'cassini',
    description: 'Los óvalos de Cassini son curvas cuya distancia a dos focos tiene un producto constante.',
    bounds: [-5, 5, -5, 5],
    kind: 'implicit',
    params: [
      { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.7 },
      { key: 'b', label: 'b', min: 0.5, max: 4, step: 0.1, value: 2.5 }
    ],
    equation: (params) => curveEquation('cassini', params),
    fn: (x, y, params) => (Math.hypot(x - params.a, y) * Math.hypot(x + params.a, y)) - params.b * params.b
  },
  {
    key: 'archimedean-spiral',
    title: 'Espiral de Arquímedes',
    route: 'archimedean-spiral',
    description: 'La espiral de Arquímedes acumula distancia proporcional al ángulo, y aparece en fenómenos de crecimiento lineal.',
    bounds: [-8, 8, -8, 8],
    kind: 'parametric',
    params: [
      { key: 'a', label: 'a', min: 0.2, max: 3, step: 0.1, value: 0.6 },
      { key: 'b', label: 'b', min: 0.2, max: 2, step: 0.1, value: 0.7 }
    ],
    equation: (params) => curveEquation('archimedean-spiral', params),
    paramX: (t, params) => (params.a + params.b * t) * Math.cos(t),
    paramY: (t, params) => (params.a + params.b * t) * Math.sin(t)
  },
  {
    key: 'logarithmic-spiral',
    title: 'Espiral logarítmica',
    route: 'logarithmic-spiral',
    description: 'La espiral logarítmica crece exponencialmente con el ángulo y aparece en conchas y patrones naturales.',
    bounds: [-12, 12, -12, 12],
    kind: 'parametric',
    params: [
      { key: 'a', label: 'a', min: 0.2, max: 2, step: 0.1, value: 0.8 },
      { key: 'b', label: 'b', min: 0.2, max: 1, step: 0.05, value: 0.35 }
    ],
    equation: (params) => curveEquation('logarithmic-spiral', params),
    paramX: (t, params) => params.a * Math.exp(params.b * t) * Math.cos(t),
    paramY: (t, params) => params.a * Math.exp(params.b * t) * Math.sin(t)
  },
  {
    key: 'astroid',
    title: 'Astroide',
    route: 'astroid',
    description: 'El astroide es una curva con cuatro cúspides y una relación directa con los denominados “máximos de una ecuación de cuarto grado”.',
    bounds: [-3, 3, -3, 3],
    kind: 'implicit',
    params: [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.8 }],
    equation: (params) => curveEquation('astroid', params),
    fn: (x, y, params) => Math.pow(Math.abs(x), 2 / 3) + Math.pow(Math.abs(y), 2 / 3) - Math.pow(params.a, 2 / 3)
  },
  {
    key: 'deltoid',
    title: 'Deltoide',
    route: 'deltoid',
    description: 'Una deltoide es una curva con tres puntas y una fuerte simetría triangular que aparece en geometría clásica.',
    bounds: [-4, 4, -4, 4],
    kind: 'parametric',
    params: [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.4 }],
    equation: (params) => curveEquation('deltoid', params),
    paramX: (t, params) => 2 * params.a * Math.cos(t) + params.a * Math.cos(2 * t),
    paramY: (t, params) => 2 * params.a * Math.sin(t) - params.a * Math.sin(2 * t)
  },
  {
    key: 'trifolium',
    title: 'Trifolio',
    route: 'trifolium',
    description: 'El trifolio es una curva de tres pétalos con simetría triangular y una forma muy reconocible en la geometría polar.',
    bounds: [-3, 3, -3, 3],
    kind: 'implicit',
    params: [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }],
    equation: (params) => curveEquation('trifolium', params),
    fn: (x, y, params) => {
      const r = Math.hypot(x, y);
      const theta = Math.atan2(y, x);
      return r - params.a * Math.cos(3 * theta);
    }
  },
  {
    key: 'epicycloid',
    title: 'Epicicloide',
    route: 'epicycloid',
    description: 'La epicicloide se genera al rodar una circunferencia alrededor del exterior de otra; crea formas con puntas marcadas.',
    bounds: [-8, 8, -8, 8],
    kind: 'parametric',
    params: [
      { key: 'R', label: 'R', min: 1, max: 6, step: 0.5, value: 3 },
      { key: 'r', label: 'r', min: 0.5, max: 4, step: 0.1, value: 1.2 }
    ],
    equation: (params) => curveEquation('epicycloid', params),
    paramX: (t, params) => (params.R + params.r) * Math.cos(t) - params.r * Math.cos(((params.R + params.r) / params.r) * t),
    paramY: (t, params) => (params.R + params.r) * Math.sin(t) - params.r * Math.sin(((params.R + params.r) / params.r) * t)
  },
  {
    key: 'hypocycloid',
    title: 'Hipocicloide',
    route: 'hypocycloid',
    description: 'La hipocicloide surge al rodar una circunferencia dentro de otra, y produce curvas ornamentales con múltiples puntas.',
    bounds: [-8, 8, -8, 8],
    kind: 'parametric',
    params: [
      { key: 'R', label: 'R', min: 2, max: 8, step: 0.5, value: 5 },
      { key: 'r', label: 'r', min: 0.5, max: 3, step: 0.1, value: 1.5 }
    ],
    equation: (params) => curveEquation('hypocycloid', params),
    paramX: (t, params) => (params.R - params.r) * Math.cos(t) + params.r * Math.cos(((params.R - params.r) / params.r) * t),
    paramY: (t, params) => (params.R - params.r) * Math.sin(t) - params.r * Math.sin(((params.R - params.r) / params.r) * t)
  },
  {
    key: 'cycloid',
    title: 'Cicloide',
    route: 'cycloid',
    description: 'La cicloide es la trayectoria de un punto de una rueda en giro y es un ejemplo clásico de curva de rodadura.',
    bounds: [-8, 8, -3, 5],
    kind: 'parametric',
    params: [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 }],
    equation: (params) => curveEquation('cycloid', params),
    paramX: (t, params) => params.a * (t - Math.sin(t)),
    paramY: (t, params) => params.a * (1 - Math.cos(t))
  },
  {
    key: 'lissajous',
    title: 'Curva de Lissajous',
    route: 'lissajous',
    description: 'Las curvas de Lissajous describen órbitas periódicas formadas por dos movimientos armónicos ortogonales.',
    bounds: [-3, 3, -3, 3],
    kind: 'parametric',
    params: [
      { key: 'a', label: 'a', min: 1, max: 3, step: 0.2, value: 2 },
      { key: 'b', label: 'b', min: 1, max: 5, step: 0.2, value: 3 },
      { key: 'd', label: 'd', min: 0, max: 2, step: 0.1, value: 0.5 }
    ],
    equation: (params) => curveEquation('lissajous', params),
    paramX: (t, params) => Math.sin(params.a * t + params.d),
    paramY: (t, params) => Math.sin(params.b * t)
  },
  {
    key: 'conchoid',
    title: 'Concoide de Nicomedes',
    route: 'conchoid',
    description: 'La concoide es una curva de construcción clásica asociada a líneas y puntos fijos, muy útil como ejemplo de lugar geométrico.',
    bounds: [-8, 8, -8, 8],
    kind: 'implicit',
    params: [
      { key: 'a', label: 'a', min: 0.5, max: 4, step: 0.1, value: 1.5 },
      { key: 'b', label: 'b', min: 0.5, max: 4, step: 0.1, value: 2 }
    ],
    equation: (params) => curveEquation('conchoid', params),
    fn: (x, y, params) => (x * x + y * y) * (x - params.a) * (x - params.a) - params.b * params.b * x * x
  },
  {
    key: 'cissoid',
    title: 'Cisoide de Diocles',
    route: 'cissoid',
    description: 'La cisoide de Diocles es una curva histórica que apareció en los primeros estudios sobre resolución de problemas geométricos.',
    bounds: [-6, 6, -6, 6],
    kind: 'implicit',
    params: [{ key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.4 }],
    equation: (params) => curveEquation('cissoid', params),
    fn: (x, y, params) => y * y - (x * x * x / (2 * params.a - x))
  },
  {
    key: 'parabola-like',
    title: 'Curva de la semielipse',
    route: 'parabola-like',
    description: 'Esta curva mezcla la forma cerrada de la elipse con la simetría abierta de la parábola para mostrar una familia de trazados muy visuales.',
    bounds: [-4, 4, -3, 3],
    kind: 'implicit',
    params: [
      { key: 'a', label: 'a', min: 0.5, max: 3, step: 0.1, value: 1.5 },
      { key: 'b', label: 'b', min: 0.5, max: 3, step: 0.1, value: 1.2 }
    ],
    equation: (params) => curveEquation('parabola-like', params),
    fn: (x, y, params) => (x * x / (params.a * params.a)) + (y * y / (params.b * params.b)) - 1 - x * x
  }
];

@Component({
  selector: 'app-curve-article',
  standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, ImplicitCurveGraphComponent],
  templateUrl: './curve-article.component.html',
  styleUrls: ['./curve-article.component.css', '../curve-widget.css']
})
export class CurveArticleComponent implements OnInit, AfterViewInit {
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;

  curves = CURVE_DEFINITIONS;
  curve!: CurveDefinition;
  params: Record<string, number> = {};
  equation = 'x = y';
  get generalEquation(): string { return curveEquation(this.curve?.key ?? ''); }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const keyFromRoute = this.route.snapshot.data['curve'] ?? this.route.snapshot.routeConfig?.path ?? this.curves[0].route;
    this.curve = this.curves.find((item) => item.route === keyFromRoute) ?? this.curves[0];
    this.params = Object.fromEntries(this.curve.params.map((param) => [param.key, param.value]));
    this.equation = this.curve.equation(this.params);
    this.curveGraph.setBounds(...this.curve.bounds);
  }

  ngAfterViewInit(): void {
    this.onDraw();
  }

  onParamChanged(key: string, value: number): void {
    const definition = this.curve.params.find(param => param.key === key);
    if (!definition || value === null || !Number.isFinite(value)) return;
    this.params[key] = Math.max(definition.min, Math.min(definition.max, value));
    this.equation = this.curve.equation(this.params);
    this.onDraw();
  }

  onDraw(): void {
    this.curveGraph.setBounds(...this.curve.bounds);

    if (this.curve.kind === 'implicit' && this.curve.fn) {
      this.curveGraph.functions = [
        new GraphableFunction((x: number, y: number) => this.curve.fn!(x, y, this.params), 'red')
      ];
      this.curveGraph.drawGraph();
      return;
    }

    this.curveGraph.clear();
    this.curveGraph.drawAxes();
    this.curveGraph.draw((ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      const steps = 1200;
      for (let i = 0; i < steps; i++) {
        const t = -Math.PI + (i / steps) * (2 * Math.PI);
        const x = this.curve.paramX!(t, this.params);
        const y = this.curve.paramY!(t, this.params);
        const point = this.curveGraph.xyToPixel(new Vec2(x, y));
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    });
  }
}
