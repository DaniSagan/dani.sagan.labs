import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-densidad-triangular-y-su-media-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-densidad-triangular-y-su-media-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDensidadTriangularYSuMediaProblemComponent {
  static readonly title = "Una densidad triangular y su media";
  static readonly route = 'problema-178';
  static readonly problem: PracticeProblem = {
  "id": "problema-178",
  "number": 178,
  "title": "Una densidad triangular y su media",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Repaso",
  "statement": "Sea f(x)=2x en [0,1] y cero fuera. Comprueba que es una densidad, calcula P(X≤1/2) y la media.",
  "resources": [
    {
      "label": "Variables continuas: densidad, esperanza y varianza",
      "route": "/articles/continuous-random-variables",
      "activity": "Practica una densidad triangular y su media. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Función de distribución, colas y probabilidades acumuladas",
      "route": "/articles/distribution-functions-tails",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
