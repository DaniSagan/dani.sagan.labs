import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-serie-telescopica-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-serie-telescopica-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSerieTelescopicaProblemComponent {
  static readonly title = "Una serie telescópica";
  static readonly route = "telescoping-series";
  static readonly problem: PracticeProblem = {
  "id": "problema-044",
  "route": "telescoping-series",
  "number": 44,
  "title": "Una serie telescópica",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Repaso",
  "statement": "Calcula \\(\\sum_{n=1}^{\\infty}\\frac{1}{n(n+1)}\\).",
  "resources": [
    {
      "label": "Series telescópicas",
      "route": "/articles/telescoping-series",
      "activity": "Descompón los términos en diferencias y controla las sumas parciales, la frontera y el error restante."
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
      "label": "Descomposición en fracciones parciales",
      "route": "/articles/integration-classical",
      "fragment": "rational",
      "activity": "Compara coeficientes después de reunir denominadores y conserva el dominio."
    }
  ]
};
}
