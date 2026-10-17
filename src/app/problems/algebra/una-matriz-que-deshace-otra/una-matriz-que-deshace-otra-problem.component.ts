import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-matriz-que-deshace-otra-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-matriz-que-deshace-otra-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaMatrizQueDeshaceOtraProblemComponent {
  static readonly title = "Una matriz que deshace otra";
  static readonly route = 'problema-120';
  static readonly problem: PracticeProblem = {
  "id": "problema-120",
  "number": 120,
  "title": "Una matriz que deshace otra",
  "category": "Álgebra y álgebra lineal",
  "topic": "Matrices y sistemas",
  "level": "Repaso",
  "statement": "Encuentra la inversa de la matriz con filas (2,1) y (1,1), y úsala para resolver 2x+y=7, x+y=4.",
  "resources": [
    {
      "label": "El determinante: área, volumen y orientación",
      "route": "/articles/matrix-determinant",
      "activity": "Practica una matriz que deshace otra. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
