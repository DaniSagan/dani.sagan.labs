import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-monedas-de-dos-valores-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './monedas-de-dos-valores-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class MonedasDeDosValoresProblemComponent {
  static readonly title = "Monedas de dos valores";
  static readonly route = "two-denomination-coin-equation";
  static readonly problem: PracticeProblem = {
  "id": "problema-006",
  "route": "two-denomination-coin-equation",
  "number": 6,
  "title": "Monedas de dos valores",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Oposición",
  "statement": "Resuelve \\(7x+11y=100\\) en enteros no negativos e interpreta \\(x,y\\) como cantidades de monedas.",
  "resources": [
    {
      "label": "El problema de las monedas y el número de Frobenius",
      "route": "/articles/frobenius-coins",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Ecuaciones diofánticas lineales",
      "route": "/articles/linear-diophantine-equations",
      "activity": "Familias de soluciones enteras y su relación con divisibilidad y Bézout."
    },
    {
      "label": "Congruencias, clases e inversos modulares",
      "route": "/articles/modular-arithmetic",
      "activity": "Interpreta la igualdad de restos y comprueba cuándo existe un inverso."
    },
    {
      "label": "Tablas de signos e inecuaciones",
      "route": "/articles/sign-charts",
      "activity": "Separa ceros y puntos excluidos antes de decidir dónde se cumple una desigualdad."
    }
  ]
};
}
