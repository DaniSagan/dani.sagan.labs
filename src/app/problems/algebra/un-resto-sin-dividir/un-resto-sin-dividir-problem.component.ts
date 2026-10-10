import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-resto-sin-dividir-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-resto-sin-dividir-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnRestoSinDividirProblemComponent {
  static readonly title = "Un resto sin dividir";
  static readonly route = "problema-013";
  static readonly problem: PracticeProblem = {
    "id": "problema-013",
    "number": 13,
    "title": "Un resto sin dividir",
    "category": "Álgebra y álgebra lineal",
    "topic": "Polinomios y desigualdades",
    "level": "Repaso",
    "statement": "Halla el resto de dividir \\(x^{2026}+3x+1\\) entre \\(x^{2}-1\\).",
    "resources": [
      {
        "label": "Polinomios ciclotómicos",
        "route": "/articles/cyclotomic-polynomials",
        "activity": "Factorizaciones de potencias menos uno y raíces de la unidad en el plano complejo."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
