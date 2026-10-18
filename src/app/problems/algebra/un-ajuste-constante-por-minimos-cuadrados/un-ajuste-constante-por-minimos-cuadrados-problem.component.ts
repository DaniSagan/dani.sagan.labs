import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-ajuste-constante-por-minimos-cuadrados-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-ajuste-constante-por-minimos-cuadrados-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnAjusteConstantePorMinimosCuadradosProblemComponent {
  static readonly title = "Un ajuste constante por mínimos cuadrados";
  static readonly route = "least-squares-constant-fit";
  static readonly problem: PracticeProblem = {
  "id": "problema-119",
  "route": "least-squares-constant-fit",
  "number": 119,
  "title": "Un ajuste constante por mínimos cuadrados",
  "category": "Álgebra y álgebra lineal",
  "topic": "Matrices y sistemas",
  "level": "Repaso",
  "statement": "Aproxima las mediciones 2, 4 y 9 por una sola constante c minimizando la suma de errores cuadrados.",
  "resources": [
    {
      "label": "Proyecciones ortogonales y mínimos cuadrados",
      "route": "/articles/projection-least-squares",
      "activity": "Practica un ajuste constante por mínimos cuadrados. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Derivadas parciales y minimización en varias variables",
      "route": "/articles/partial-derivatives-minimization",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Media, mediana, varianza y desviación típica",
      "route": "/articles/descriptive-statistics",
      "activity": "Distingue posición de dispersión y especifica el divisor de la varianza."
    }
  ]
};
}
