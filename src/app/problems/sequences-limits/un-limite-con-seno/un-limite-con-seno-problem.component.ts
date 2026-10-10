import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-limite-con-seno-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-limite-con-seno-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnLimiteConSenoProblemComponent {
  static readonly title = "Un límite con seno";
  static readonly route = "problema-046";
  static readonly problem: PracticeProblem = {
    "id": "problema-046",
    "number": 46,
    "title": "Un límite con seno",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Límites y continuidad",
    "level": "Repaso",
    "statement": "Calcula \\(\\lim_{x\\to0}\\frac{\\sin(3x)-3x}{x^3}\\).",
    "resources": [
      {
        "label": "Series de Taylor",
        "route": "/articles/taylor-series",
        "activity": "Aproximaciones locales, derivadas y términos de error en desarrollos de funciones."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      }
    ]
  };
}
