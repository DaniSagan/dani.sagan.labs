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
  static readonly route = "inverse-matrix";
  static readonly problem: PracticeProblem = {
  "id": "problema-120",
  "route": "inverse-matrix",
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
    },
    {
      "label": "Eliminación de Gauss y sistemas compatibles",
      "route": "/articles/gaussian-elimination",
      "activity": "Entiende qué operaciones conservan las soluciones de un sistema."
    },
    {
      "label": "Dominio y transformaciones equivalentes",
      "route": "/articles/equation-equivalence",
      "fragment": "domain",
      "activity": "Conserva las exclusiones al cancelar o multiplicar y comprueba las soluciones obtenidas."
    },
    {
      "label": "Laboratorio de álgebra lineal",
      "route": "/tools/linear-algebra",
      "activity": "Introduce las matrices o vectores del enunciado y contrasta productos, rangos y determinantes."
    }
  ]
};
}
