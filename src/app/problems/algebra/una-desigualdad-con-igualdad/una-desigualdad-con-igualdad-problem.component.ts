import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-desigualdad-con-igualdad-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-desigualdad-con-igualdad-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDesigualdadConIgualdadProblemComponent {
  static readonly title = "Una desigualdad con igualdad";
  static readonly route = "problema-014";
  static readonly problem: PracticeProblem = {
    "id": "problema-014",
    "number": 14,
    "title": "Una desigualdad con igualdad",
    "category": "Álgebra y álgebra lineal",
    "topic": "Polinomios y desigualdades",
    "level": "Oposición",
    "statement": "Demuestra que \\((a+b+c)(1/a+1/b+1/c)\\ge 9\\) para \\(a,b,c>0\\) e identifica cuándo hay igualdad.",
    "resources": [
      {
        "label": "Determinantes",
        "route": "/articles/matrix-determinant",
        "activity": "Conexión con determinantes: los dos vectores de Cauchy tienen matriz de Gram ((a+b+c,3),(3,1/a+1/b+1/c)); su determinante no negativo equivale a la desigualdad."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
