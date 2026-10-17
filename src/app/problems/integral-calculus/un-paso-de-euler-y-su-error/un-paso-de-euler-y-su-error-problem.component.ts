import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-paso-de-euler-y-su-error-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-paso-de-euler-y-su-error-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnPasoDeEulerYSuErrorProblemComponent {
  static readonly title = "Un paso de Euler y su error";
  static readonly route = 'problema-170';
  static readonly problem: PracticeProblem = {
  "id": "problema-170",
  "number": 170,
  "title": "Un paso de Euler y su error",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Repaso",
  "statement": "Para y′=y, y(0)=1, aplica Euler con paso 0,5 hasta t=1 y compara con y(1)=e.",
  "resources": [
    {
      "label": "Integración numérica de ecuaciones diferenciales",
      "route": "/articles/ode-numerical-integration",
      "activity": "Practica un paso de Euler y su error. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
