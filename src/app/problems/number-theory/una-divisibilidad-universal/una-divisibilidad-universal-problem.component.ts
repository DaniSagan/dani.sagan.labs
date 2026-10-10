import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-divisibilidad-universal-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-divisibilidad-universal-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDivisibilidadUniversalProblemComponent {
  static readonly title = "Una divisibilidad universal";
  static readonly route = "problema-008";
  static readonly problem: PracticeProblem = {
    "id": "problema-008",
    "number": 8,
    "title": "Una divisibilidad universal",
    "category": "Aritmética y teoría de números",
    "topic": "Diofánticas y demostraciones",
    "level": "Oposición",
    "statement": "Demuestra que \\(n^{5}-n\\) es divisible entre 30 para todo entero n.",
    "resources": [
      {
        "label": "Pequeño teorema de Fermat",
        "route": "/articles/fermats-little-theorem",
        "activity": "La congruencia de potencias usada en la prueba de divisibilidad por un primo."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      }
    ]
  };
}
