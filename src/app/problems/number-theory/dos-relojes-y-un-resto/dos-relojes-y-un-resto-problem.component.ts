import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-relojes-y-un-resto-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-relojes-y-un-resto-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosRelojesYUnRestoProblemComponent {
  static readonly title = "Dos relojes y un resto";
  static readonly route = "problema-003";
  static readonly problem: PracticeProblem = {
    "id": "problema-003",
    "number": 3,
    "title": "Dos relojes y un resto",
    "category": "Aritmética y teoría de números",
    "topic": "Divisibilidad y congruencias",
    "level": "Oposición",
    "statement": "Encuentra el menor entero positivo que deja resto 2 al dividir entre 7 y resto 3 al dividir entre 11.",
    "resources": [
      {
        "label": "Teorema chino del resto",
        "route": "/articles/chinese-remainder-theorem",
        "activity": "Compatibilidad y unicidad modular de sistemas de congruencias con módulos coprimos."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      }
    ]
  };
}
