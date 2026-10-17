import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-por-que-raiz-de-tres-es-irracional-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './por-que-raiz-de-tres-es-irracional-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class PorQueRaizDeTresEsIrracionalProblemComponent {
  static readonly title = "Por qué raíz de tres es irracional";
  static readonly route = 'problema-110';
  static readonly problem: PracticeProblem = {
  "id": "problema-110",
  "number": 110,
  "title": "Por qué raíz de tres es irracional",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Repaso",
  "statement": "Demuestra que √3 no es una fracción de enteros.",
  "resources": [
    {
      "label": "Teorema fundamental de la aritmética",
      "route": "/articles/fundamental-theorem-arithmetic",
      "activity": "Practica por qué raíz de tres es irracional. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Cómo demostrar: implicaciones, contradicción y contraposición",
      "route": "/articles/proof-strategies",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
