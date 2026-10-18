import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-suma-de-potencias-de-dos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-suma-de-potencias-de-dos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSumaDePotenciasDeDosProblemComponent {
  static readonly title = "Una suma de potencias de dos";
  static readonly route = "sum-of-powers-of-two";
  static readonly problem: PracticeProblem = {
  "id": "problema-141",
  "route": "sum-of-powers-of-two",
  "number": 141,
  "title": "Una suma de potencias de dos",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Repaso",
  "statement": "Calcula 1+2+4+…+2¹⁰ sin sumar los once términos uno a uno.",
  "resources": [
    {
      "label": "Progresiones y series geométricas",
      "route": "/articles/geometric-series",
      "activity": "Practica una suma de potencias de dos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Contradicción, implicación y equivalencia",
      "route": "/articles/proof-strategies",
      "activity": "Separa una demostración para todos los casos de una comprobación particular."
    }
  ]
};
}
