import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-polinomio-por-agrupacion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-polinomio-por-agrupacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnPolinomioPorAgrupacionProblemComponent {
  static readonly title = "Un polinomio por agrupación";
  static readonly route = 'problema-112';
  static readonly problem: PracticeProblem = {
  "id": "problema-112",
  "number": 112,
  "title": "Un polinomio por agrupación",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Repaso",
  "statement": "Factoriza x³−2x²−x+2 y resuelve x³−2x²−x+2=0 en los reales.",
  "resources": [
    {
      "label": "Teorema de las raíces racionales",
      "route": "/articles/rational-root-theorem",
      "activity": "Practica un polinomio por agrupación. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Identidades algebraicas y técnicas de factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
