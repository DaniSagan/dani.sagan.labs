import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-potencias-por-autovectores-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './potencias-por-autovectores-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class PotenciasPorAutovectoresProblemComponent {
  static readonly title = "Potencias por autovectores";
  static readonly route = "problema-017";
  static readonly problem: PracticeProblem = {
    "id": "problema-017",
    "number": 17,
    "title": "Potencias por autovectores",
    "category": "Álgebra y álgebra lineal",
    "topic": "Matrices y sistemas",
    "level": "Reto",
    "statement": "Sea \\(A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}\\). Calcula \\(A^{n}\\) para todo entero \\(n\\ge 0\\).",
    "resources": [
      {
        "label": "Diagonalización de matrices",
        "route": "/articles/matrix-diagonalization",
        "activity": "Autovalores, bases de autovectores y cálculo de potencias de una matriz."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
