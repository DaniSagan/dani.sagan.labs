import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-convergencia-absoluta-o-condicional-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './convergencia-absoluta-o-condicional-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ConvergenciaAbsolutaOCondicionalProblemComponent {
  static readonly title = "Convergencia absoluta o condicional";
  static readonly route = "problema-045";
  static readonly problem: PracticeProblem = {
    "id": "problema-045",
    "number": 45,
    "title": "Convergencia absoluta o condicional",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Sucesiones y series",
    "level": "Oposición",
    "statement": "Estudia \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{\\sqrt n}\\) y su convergencia absoluta.",
    "resources": [
      {
        "label": "Problema de Basilea",
        "route": "/articles/basel",
        "activity": "Una lectura complementaria sobre sumas infinitas y la diferencia entre convergencia y cálculo de su valor."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      }
    ]
  };
}
