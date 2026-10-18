import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-resto-con-dividendo-negativo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-resto-con-dividendo-negativo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnRestoConDividendoNegativoProblemComponent {
  static readonly title = "Un resto con dividendo negativo";
  static readonly route = "remainder-with-negative-dividend";
  static readonly problem: PracticeProblem = {
  "id": "problema-101",
  "route": "remainder-with-negative-dividend",
  "number": 101,
  "title": "Un resto con dividendo negativo",
  "category": "Aritmética y teoría de números",
  "topic": "Divisibilidad y congruencias",
  "level": "Repaso",
  "statement": "Divide −47 entre 6 usando un resto no negativo. Explica por qué el cociente no es −7.",
  "resources": [
    {
      "label": "Teorema de la división euclídea",
      "route": "/articles/division-algorithm",
      "activity": "Practica un resto con dividendo negativo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Congruencias, clases e inversos modulares",
      "route": "/articles/modular-arithmetic",
      "activity": "Interpreta la igualdad de restos y comprueba cuándo existe un inverso."
    }
  ]
};
}
