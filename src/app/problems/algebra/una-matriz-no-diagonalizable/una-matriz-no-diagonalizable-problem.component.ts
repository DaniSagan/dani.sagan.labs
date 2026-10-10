import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-matriz-no-diagonalizable-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-matriz-no-diagonalizable-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaMatrizNoDiagonalizableProblemComponent {
  static readonly title = "Una matriz no diagonalizable";
  static readonly route = "problema-020";
  static readonly problem: PracticeProblem = {
    "id": "problema-020",
    "number": 20,
    "title": "Una matriz no diagonalizable",
    "category": "Álgebra y álgebra lineal",
    "topic": "Matrices y sistemas",
    "level": "Reto",
    "statement": "Para \\(A=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}\\), demuestra que no es diagonalizable y calcula \\(A^{n}\\) para \\(n\\ge 0\\).",
    "resources": [
      {
        "label": "Diagonalización de matrices",
        "route": "/articles/matrix-diagonalization",
        "activity": "Autovalores, bases de autovectores y cálculo de potencias de una matriz."
      },
      {
        "label": "Teorema del binomio",
        "route": "/articles/binomial-theorem",
        "activity": "Coeficientes combinatorios y expansión de potencias de una suma."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
