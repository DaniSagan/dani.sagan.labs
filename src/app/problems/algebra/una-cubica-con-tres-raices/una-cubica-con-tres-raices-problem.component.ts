import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-cubica-con-tres-raices-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-cubica-con-tres-raices-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaCubicaConTresRaicesProblemComponent {
  static readonly title = "Una cúbica con tres raíces";
  static readonly route = "problema-011";
  static readonly problem: PracticeProblem = {
    "id": "problema-011",
    "number": 11,
    "title": "Una cúbica con tres raíces",
    "category": "Álgebra y álgebra lineal",
    "topic": "Polinomios y desigualdades",
    "level": "Repaso",
    "statement": "Resuelve \\(x^{3}-6x^{2}+11x-6=0\\) y justifica que no hay más raíces reales.",
    "resources": [
      {
        "label": "La ecuación cúbica",
        "route": "/articles/cubic-equation",
        "activity": "Lectura complementaria sobre raíces, factorización y resolución de ecuaciones polinómicas."
      },
      {
        "label": "Laboratorio de álgebra lineal",
        "route": "/tools/linear-algebra",
        "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
      }
    ]
  };
}
