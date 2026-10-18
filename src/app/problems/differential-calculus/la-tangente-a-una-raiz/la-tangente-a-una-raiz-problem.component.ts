import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-la-tangente-a-una-raiz-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './la-tangente-a-una-raiz-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LaTangenteAUnaRaizProblemComponent {
  static readonly title = "La tangente a una raíz";
  static readonly route = "square-root-tangent";
  static readonly problem: PracticeProblem = {
  "id": "problema-152",
  "route": "square-root-tangent",
  "number": 152,
  "title": "La tangente a una raíz",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Encuentra la recta tangente a f(x)=√x en x=4 y úsala para aproximar √4,1.",
  "resources": [
    {
      "label": "Diferenciales y aproximación lineal",
      "route": "/articles/linear-approximation",
      "activity": "Practica la tangente a una raíz. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
    }
  ]
};
}
