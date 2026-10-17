import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-fraccion-continua-corta-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-fraccion-continua-corta-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaFraccionContinuaCortaProblemComponent {
  static readonly title = "Una fracción continua corta";
  static readonly route = 'problema-109';
  static readonly problem: PracticeProblem = {
  "id": "problema-109",
  "number": 109,
  "title": "Una fracción continua corta",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Repaso",
  "statement": "Escribe 43/19 como fracción continua simple y reconstruye la fracción desde ella.",
  "resources": [
    {
      "label": "Fracciones continuas",
      "route": "/articles/continued-fractions",
      "activity": "Practica una fracción continua corta. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
