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
  static readonly route = "absolute-and-conditional-convergence";
  static readonly problem: PracticeProblem = {
  "id": "problema-045",
  "route": "absolute-and-conditional-convergence",
  "number": 45,
  "title": "Convergencia absoluta o condicional",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Oposición",
  "statement": "Estudia \\(\\sum_{n=1}^{\\infty}\\frac{(-1)^{n-1}}{\\sqrt n}\\) y su convergencia absoluta.",
  "resources": [
    {
      "label": "Convergencia absoluta, condicional y criterio de Leibniz",
      "route": "/articles/series-convergence",
      "activity": "Aplica Leibniz, distingue convergencia absoluta y condicional y acota el error de la suma parcial."
    },
    {
      "label": "Problema de Basilea",
      "route": "/articles/basel",
      "activity": "Una lectura complementaria sobre sumas infinitas y la diferencia entre convergencia y cálculo de su valor."
    },
    {
      "label": "Criterios de convergencia de series positivas",
      "route": "/articles/positive-series-tests",
      "activity": "Compara el comportamiento asintótico con series modelo y revisa las fronteras de cada criterio."
    },
    {
      "label": "Primitivas y teorema fundamental del cálculo",
      "route": "/articles/integration-classical",
      "fragment": "fundamental",
      "activity": "Distingue una familia de funciones de una integral definida con signo."
    }
  ]
};
}
