import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-punto-del-teorema-del-valor-medio-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-punto-del-teorema-del-valor-medio-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnPuntoDelTeoremaDelValorMedioProblemComponent {
  static readonly title = "Un punto del teorema del valor medio";
  static readonly route = 'problema-156';
  static readonly problem: PracticeProblem = {
  "id": "problema-156",
  "number": 156,
  "title": "Un punto del teorema del valor medio",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Aplica el teorema del valor medio a f(x)=x² en [1,3] y encuentra el punto que garantiza.",
  "resources": [
    {
      "label": "Teoremas de Rolle y del valor medio",
      "route": "/articles/mean-value-theorems",
      "activity": "Practica un punto del teorema del valor medio. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
