import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-raices-y-parametro-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './raices-y-parametro-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RaicesYParametroProblemComponent {
  static readonly title = "Raíces y parámetro";
  static readonly route = "problema-012";
  static readonly problem: PracticeProblem = {
    "id": "problema-012",
    "number": 12,
    "title": "Raíces y parámetro",
    "category": "Álgebra y álgebra lineal",
    "topic": "Polinomios y desigualdades",
    "level": "Oposición",
    "statement": "Determina los valores reales de a para los que \\(x^{2}-2ax+a+2\\) tiene dos raíces reales distintas y positivas.",
    "resources": [
      {
        "label": "La ecuación cúbica",
        "route": "/articles/cubic-equation",
        "activity": "Compara el papel de las raíces y los parámetros en una ecuación cúbica con la clasificación cuadrática de este ejercicio; las fórmulas de los discriminantes son distintas."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
