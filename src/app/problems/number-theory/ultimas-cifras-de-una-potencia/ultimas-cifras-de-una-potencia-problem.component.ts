import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-ultimas-cifras-de-una-potencia-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './ultimas-cifras-de-una-potencia-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UltimasCifrasDeUnaPotenciaProblemComponent {
  static readonly title = "Últimas cifras de una potencia";
  static readonly route = "problema-004";
  static readonly problem: PracticeProblem = {
    "id": "problema-004",
    "number": 4,
    "title": "Últimas cifras de una potencia",
    "category": "Aritmética y teoría de números",
    "topic": "Divisibilidad y congruencias",
    "level": "Oposición",
    "statement": "Calcula las dos últimas cifras de \\(7^{2026}\\) sin calcular la potencia completa.",
    "resources": [
      {
        "label": "Orden multiplicativo",
        "route": "/articles/orders-theorem",
        "activity": "El papel de los ciclos de potencias al reducir exponentes en aritmética modular."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      }
    ]
  };
}
