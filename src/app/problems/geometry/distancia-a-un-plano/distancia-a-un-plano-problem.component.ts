import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-distancia-a-un-plano-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './distancia-a-un-plano-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DistanciaAUnPlanoProblemComponent {
  static readonly title = "Distancia a un plano";
  static readonly route = "problema-028";
  static readonly problem: PracticeProblem = {
    "id": "problema-028",
    "number": 28,
    "title": "Distancia a un plano",
    "category": "Geometría",
    "topic": "Geometría analítica y espacio",
    "level": "Oposición",
    "statement": "Calcula la distancia de \\(P=(1,2,3)\\) al plano \\(2x-y+2z-4=0\\) y su proyección ortogonal.",
    "resources": [
      {
        "label": "Determinantes",
        "route": "/articles/matrix-determinant",
        "activity": "Propiedades algebraicas y significado geométrico de los determinantes."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
