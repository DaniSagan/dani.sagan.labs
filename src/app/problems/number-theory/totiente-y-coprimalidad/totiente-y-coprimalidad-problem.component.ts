import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-totiente-y-coprimalidad-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './totiente-y-coprimalidad-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TotienteYCoprimalidadProblemComponent {
  static readonly title = "Totiente y coprimalidad";
  static readonly route = "problema-005";
  static readonly problem: PracticeProblem = {
    "id": "problema-005",
    "number": 5,
    "title": "Totiente y coprimalidad",
    "category": "Aritmética y teoría de números",
    "topic": "Divisibilidad y congruencias",
    "level": "Repaso",
    "statement": "Calcula \\(\\varphi (360)\\) y la probabilidad de que un entero elegido uniformemente entre 1 y 360 sea coprimo con 360.",
    "resources": [
      {
        "label": "Probabilidad en espacios finitos: sucesos y regla de Laplace",
        "route": "/articles/finite-probability",
        "activity": "Define los resultados elementales, justifica su equiprobabilidad y cuenta la intersección antes de condicionar o comprobar independencia."
      },
      {
        "label": "Función totiente de Euler",
        "route": "/articles/euler-totient-formula",
        "activity": "La fórmula que cuenta los enteros coprimos a partir de los divisores primos."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      },
      {
        "label": "Principio de inclusión y exclusión",
        "route": "/articles/inclusion-exclusion",
        "activity": "Corrige el doble conteo de propiedades que se solapan mediante sus intersecciones."
      }
    ]
  };
}
