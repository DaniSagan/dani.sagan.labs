import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-sistema-con-parametro-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './sistema-con-parametro-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class SistemaConParametroProblemComponent {
  static readonly title = "Sistema con parámetro";
  static readonly route = "problema-016";
  static readonly problem: PracticeProblem = {
    "id": "problema-016",
    "number": 16,
    "title": "Sistema con parámetro",
    "category": "Álgebra y álgebra lineal",
    "topic": "Matrices y sistemas",
    "level": "Oposición",
    "statement": "Clasifica y resuelve \\(x+y+z=1\\), \\(x+ay+z=1\\), \\(x+y+az=1\\) según el parámetro real a.",
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
