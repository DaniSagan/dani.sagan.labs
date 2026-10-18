import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-congruencia-lineal-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-congruencia-lineal-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaCongruenciaLinealProblemComponent {
  static readonly title = "Una congruencia lineal";
  static readonly route = "linear-congruence";
  static readonly problem: PracticeProblem = {
  "id": "problema-002",
  "route": "linear-congruence",
  "number": 2,
  "title": "Una congruencia lineal",
  "category": "Aritmética y teoría de números",
  "topic": "Divisibilidad y congruencias",
  "level": "Oposición",
  "statement": "Resuelve \\(18x\\equiv 30 \\pmod{42}\\) y da todas las clases de soluciones módulo 42.",
  "resources": [
    {
      "label": "Teorema de la congruencia lineal",
      "route": "/articles/linear-congruence-theorem",
      "activity": "Condiciones de existencia y número de soluciones de una congruencia lineal."
    },
    {
      "label": "Congruencias, clases e inversos modulares",
      "route": "/articles/modular-arithmetic",
      "activity": "Interpreta la igualdad de restos y comprueba cuándo existe un inverso."
    },
    {
      "label": "Máximo común divisor y algoritmo de Euclides",
      "route": "/articles/gcd-euclid",
      "activity": "Comprende por qué cada división conserva los divisores comunes."
    }
  ]
};
}
