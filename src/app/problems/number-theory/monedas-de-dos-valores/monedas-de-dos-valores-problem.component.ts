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
  static readonly route = "problema-006";
  static readonly problem: PracticeProblem = {
    "id": "problema-006",
    "number": 6,
    "title": "Monedas de dos valores",
    "category": "Aritmética y teoría de números",
    "topic": "Diofánticas y demostraciones",
    "level": "Oposición",
    "statement": "Resuelve \\(7x+11y=100\\) en enteros no negativos e interpreta \\(x,y\\) como cantidades de monedas.",
    "resources": [
      {
        "label": "Ecuaciones diofánticas lineales",
        "route": "/articles/linear-diophantine-equations",
        "activity": "Familias de soluciones enteras y su relación con divisibilidad y Bézout."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      }
    ]
  };
}
