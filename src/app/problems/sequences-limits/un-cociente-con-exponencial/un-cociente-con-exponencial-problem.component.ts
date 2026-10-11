import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-cociente-con-exponencial-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-cociente-con-exponencial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnCocienteConExponencialProblemComponent {
  static readonly title = "Un cociente con exponencial";
  static readonly route = "problema-042";
  static readonly problem: PracticeProblem = {
    "id": "problema-042",
    "number": 42,
    "title": "Un cociente con exponencial",
    "category": "Sucesiones, límites y continuidad",
    "topic": "Sucesiones y series",
    "level": "Repaso",
    "statement": "Calcula \\(\\lim_{n\\to\\infty}\\frac{n^2}{2^n}\\) y justifica la convergencia.",
    "resources": [
      {
        "label": "Límites, equivalencias y jerarquías de crecimiento",
        "route": "/articles/asymptotic-limits",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Fórmula de Stirling",
        "route": "/articles/stirling",
        "activity": "Comparación de velocidades de crecimiento mediante una aproximación asintótica del factorial."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      },
      {
        "label": "Criterios de convergencia de series positivas",
        "route": "/articles/positive-series-tests",
        "activity": "Compara el comportamiento asintótico con series modelo y revisa las fronteras de cada criterio."
      },
      {
        "label": "Regla de L’Hôpital y formas indeterminadas",
        "route": "/articles/lhopital-rule",
        "activity": "Revisa las hipótesis de L’Hôpital y compáralo con equivalencias y desarrollos de Taylor."
      }
    ]
  };
}
