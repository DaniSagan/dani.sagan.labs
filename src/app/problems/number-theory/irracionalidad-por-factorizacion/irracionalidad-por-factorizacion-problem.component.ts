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
  static readonly route = "problema-010";
  static readonly problem: PracticeProblem = {
    "id": "problema-010",
    "number": 10,
    "title": "Irracionalidad por factorización",
    "category": "Aritmética y teoría de números",
    "topic": "Diofánticas y demostraciones",
    "level": "Oposición",
    "statement": "Demuestra que \\(\\sqrt{6}\\) es irracional usando la unicidad de la factorización prima.",
    "resources": [
      {
        "label": "Teorema fundamental de la aritmética",
        "route": "/articles/fundamental-theorem-arithmetic",
        "activity": "La unicidad de la factorización prima que fundamenta la contradicción de paridades."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      }
    ]
  };
}
