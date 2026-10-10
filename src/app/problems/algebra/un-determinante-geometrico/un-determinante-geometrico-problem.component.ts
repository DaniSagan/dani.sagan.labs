import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-determinante-geometrico-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-determinante-geometrico-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnDeterminanteGeometricoProblemComponent {
  static readonly title = "Un determinante geométrico";
  static readonly route = "problema-018";
  static readonly problem: PracticeProblem = {
    "id": "problema-018",
    "number": 18,
    "title": "Un determinante geométrico",
    "category": "Álgebra y álgebra lineal",
    "topic": "Matrices y sistemas",
    "level": "Oposición",
    "statement": "Calcula \\(\\det\\begin{pmatrix}1&1&1\\\\1&2&3\\\\1&3&6\\end{pmatrix}\\), donde las ternas son filas, y decide si las filas son independientes.",
    "resources": [
      {
        "label": "Determinantes",
        "route": "/articles/matrix-determinant",
        "activity": "Propiedades algebraicas y significado geométrico de los determinantes."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
