import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-hiperbola-trasladada-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-hiperbola-trasladada-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaHiperbolaTrasladadaProblemComponent {
  static readonly title = "Una hipérbola trasladada";
  static readonly route = "problema-027";
  static readonly problem: PracticeProblem = {
    "id": "problema-027",
    "number": 27,
    "title": "Una hipérbola trasladada",
    "category": "Geometría",
    "topic": "Geometría analítica y espacio",
    "level": "Oposición",
    "statement": "Identifica la cónica \\(4x^{2}-9y^{2}-8x-18y-41=0\\), su centro y sus asíntotas.",
    "resources": [
      {
        "label": "Hipérbola",
        "route": "/articles/hyperbola",
        "activity": "Lectura sobre la forma de la cónica, sus ejes y sus asíntotas."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
