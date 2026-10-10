import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-proyeccion-ortogonal-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './proyeccion-ortogonal-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ProyeccionOrtogonalProblemComponent {
  static readonly title = "Proyección ortogonal";
  static readonly route = "problema-019";
  static readonly problem: PracticeProblem = {
    "id": "problema-019",
    "number": 19,
    "title": "Proyección ortogonal",
    "category": "Álgebra y álgebra lineal",
    "topic": "Matrices y sistemas",
    "level": "Oposición",
    "statement": "Proyecta \\(v=(2,1,3)\\) sobre el plano \\(x+y+z=0\\) y calcula la distancia de v al plano.",
    "resources": [
      {
        "label": "Determinantes",
        "route": "/articles/matrix-determinant",
        "activity": "La condición de ortogonalidad usada en la proyección está vinculada con la geometría vectorial; el artículo de determinantes ofrece otro enfoque para medir independencia y volumen."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
