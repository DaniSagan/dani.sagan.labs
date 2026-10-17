import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-numero-con-dos-condiciones-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-numero-con-dos-condiciones-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnNumeroConDosCondicionesProblemComponent {
  static readonly title = "Un número con dos condiciones";
  static readonly route = 'problema-106';
  static readonly problem: PracticeProblem = {
  "id": "problema-106",
  "number": 106,
  "title": "Un número con dos condiciones",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Repaso",
  "statement": "Busca el menor entero positivo que deja resto 2 al dividir por 5 y resto 4 al dividir por 7.",
  "resources": [
    {
      "label": "Sistemas de congruencias y Teorema Chino del Resto",
      "route": "/articles/chinese-remainder-theorem",
      "activity": "Practica un número con dos condiciones. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
