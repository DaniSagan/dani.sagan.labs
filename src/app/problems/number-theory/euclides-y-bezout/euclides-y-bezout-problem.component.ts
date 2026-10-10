import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-euclides-y-bezout-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './euclides-y-bezout-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EuclidesYBezoutProblemComponent {
  static readonly title = "Euclides y Bézout";
  static readonly route = "problema-001";
  static readonly problem: PracticeProblem = {
    "id": "problema-001",
    "number": 1,
    "title": "Euclides y Bézout",
    "category": "Aritmética y teoría de números",
    "topic": "Divisibilidad y congruencias",
    "level": "Repaso",
    "statement": "Calcula \\(\\operatorname{mcd}(252,198)\\) y encuentra enteros \\(u,v\\) tales que \\(252u+198v=\\operatorname{mcd}(252,198)\\).",
    "resources": [
      {
        "label": "Algoritmo de Euclides",
        "route": "/articles/gcd-euclid",
        "activity": "Desarrollo del algoritmo de divisiones sucesivas para calcular el máximo común divisor."
      },
      {
        "label": "Identidad de Bézout",
        "route": "/articles/bezout-identity",
        "activity": "La expresión del máximo común divisor como combinación lineal de dos enteros."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      }
    ]
  };
}
