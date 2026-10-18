import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-racionalizacion-y-limite-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './racionalizacion-y-limite-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RacionalizacionYLimiteProblemComponent {
  static readonly title = "Racionalización y límite";
  static readonly route = "limit-by-rationalization";
  static readonly problem: PracticeProblem = {
  "id": "problema-047",
  "route": "limit-by-rationalization",
  "number": 47,
  "title": "Racionalización y límite",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Repaso",
  "statement": "Calcula \\(\\lim_{x\\to0}\\frac{\\sqrt{1+x}-1}{x}\\) e indica el dominio real cerca de cero.",
  "resources": [
    {
      "label": "Límites, equivalencias y jerarquías de crecimiento",
      "route": "/articles/asymptotic-limits",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Series de Taylor",
      "route": "/articles/taylor-series",
      "activity": "El desarrollo √(1+x)=1+x/2+O(x²) ofrece una comprobación alternativa del límite calculado aquí por racionalización."
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
    },
    {
      "label": "Identidades notables y factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Desarrolla o agrupa términos para justificar la factorización utilizada."
    },
    {
      "label": "Dominio y transformaciones equivalentes",
      "route": "/articles/equation-equivalence",
      "fragment": "domain",
      "activity": "Conserva las exclusiones al cancelar o multiplicar y comprueba las soluciones obtenidas."
    },
    {
      "label": "Continuidad y derivadas laterales",
      "route": "/articles/continuity-differentiability",
      "activity": "Separa el valor, el límite y la existencia de una derivada."
    }
  ]
};
}
