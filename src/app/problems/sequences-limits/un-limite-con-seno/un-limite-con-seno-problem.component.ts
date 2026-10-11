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
        "label": "Teorema del encaje y funciones oscilantes",
        "route": "/articles/squeeze-oscillation",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Límites, equivalencias y jerarquías de crecimiento",
        "route": "/articles/asymptotic-limits",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Series de Taylor",
        "route": "/articles/taylor-series",
        "activity": "Aproximaciones locales, derivadas y términos de error en desarrollos de funciones."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
      },
      {
        "label": "Regla de L’Hôpital y formas indeterminadas",
        "route": "/articles/lhopital-rule",
        "activity": "Revisa las hipótesis de L’Hôpital y compáralo con equivalencias y desarrollos de Taylor."
      },
      {
        "label": "Error numérico, cancelación y condicionamiento",
        "route": "/articles/numerical-conditioning",
        "activity": "Separa la sensibilidad del problema de la estabilidad del cálculo y comprueba cancelaciones."
      }
    ]
  };
}
