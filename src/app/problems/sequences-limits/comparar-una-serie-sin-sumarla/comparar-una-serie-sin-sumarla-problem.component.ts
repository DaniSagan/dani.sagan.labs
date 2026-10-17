import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-comparar-una-serie-sin-sumarla-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './comparar-una-serie-sin-sumarla-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CompararUnaSerieSinSumarlaProblemComponent {
  static readonly title = "Comparar una serie sin sumarla";
  static readonly route = 'problema-149';
  static readonly problem: PracticeProblem = {
  "id": "problema-149",
  "number": 149,
  "title": "Comparar una serie sin sumarla",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Repaso",
  "statement": "Decide si la serie desde n=1 hasta infinito de 1/(n²+n+1) converge.",
  "resources": [
    {
      "label": "Criterios de convergencia de series positivas",
      "route": "/articles/positive-series-tests",
      "activity": "Practica comparar una serie sin sumarla. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
