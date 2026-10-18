import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-irracionalidad-por-factorizacion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './irracionalidad-por-factorizacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class IrracionalidadPorFactorizacionProblemComponent {
  static readonly title = "Irracionalidad por factorización";
  static readonly route = "irrationality-by-prime-factorization";
  static readonly problem: PracticeProblem = {
  "id": "problema-010",
  "route": "irrationality-by-prime-factorization",
  "number": 10,
  "title": "Irracionalidad por factorización",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Oposición",
  "statement": "Demuestra que \\(\\sqrt{6}\\) es irracional usando la unicidad de la factorización prima.",
  "resources": [
    {
      "label": "Irracionalidad y valuaciones primas",
      "route": "/articles/prime-valuations",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Teorema fundamental de la aritmética",
      "route": "/articles/fundamental-theorem-arithmetic",
      "activity": "La unicidad de la factorización prima que fundamenta la contradicción de paridades."
    },
    {
      "label": "Cómo demostrar: implicaciones, contradicción y contraposición",
      "route": "/articles/proof-strategies",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
