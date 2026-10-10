import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-potencia-de-un-punto-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './potencia-de-un-punto-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class PotenciaDeUnPuntoProblemComponent {
  static readonly title = "Potencia de un punto";
  static readonly route = "problema-024";
  static readonly problem: PracticeProblem = {
    "id": "problema-024",
    "number": 24,
    "title": "Potencia de un punto",
    "category": "Geometría",
    "topic": "Triángulos y áreas",
    "level": "Repaso",
    "statement": "Desde P exterior a una circunferencia, una secante corta primero en A y después en B, con \\(PA=4\\) y \\(PB=9\\). Calcula la tangente PT.",
    "resources": [
      {
        "label": "Potencia de un punto",
        "route": "/articles/power-of-point",
        "activity": "Relaciones entre secantes y tangentes a una circunferencia."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
