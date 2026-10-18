import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-circulo-definido-por-modulos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-circulo-definido-por-modulos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnCirculoDefinidoPorModulosProblemComponent {
  static readonly title = "Un círculo definido por módulos";
  static readonly route = "circle-defined-by-complex-moduli";
  static readonly problem: PracticeProblem = {
  "id": "problema-140",
  "route": "circle-defined-by-complex-moduli",
  "number": 140,
  "title": "Un círculo definido por módulos",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Repaso",
  "statement": "Describe geométricamente los complejos z que cumplen |z−(2−i)|=3 y halla sus intersecciones con el eje real.",
  "resources": [
    {
      "label": "Conjugado, módulo y división compleja",
      "route": "/articles/complex-arithmetic",
      "activity": "Practica un círculo definido por módulos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Valor absoluto: distancias y funciones a trozos",
      "route": "/articles/absolute-value-distance",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Rectas, circunferencias e intersecciones",
      "route": "/articles/line-circle",
      "activity": "Exige que cada punto cumpla simultáneamente las dos ecuaciones."
    },
    {
      "label": "Ecuaciones cuadráticas",
      "route": "/articles/quadratic-equations",
      "activity": "Resuelve la ecuación de segundo grado y distingue los casos degenerados."
    },
    {
      "label": "Cuadrados y soluciones extrañas",
      "route": "/articles/equation-equivalence",
      "fragment": "squaring",
      "activity": "Controla los signos antes de cuadrar para que la transformación sea reversible."
    },
    {
      "label": "Trazador de curvas implícitas",
      "route": "/tools/implicit-curve-graph",
      "activity": "Dibuja la ecuación cartesiana y comprueba centro, cortes o asíntotas."
    }
  ]
};
}
