import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-rectas-que-se-cruzan-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-rectas-que-se-cruzan-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosRectasQueSeCruzanProblemComponent {
  static readonly title = "Dos rectas que se cruzan";
  static readonly route = "problema-029";
  static readonly problem: PracticeProblem = {
    "id": "problema-029",
    "number": 29,
    "title": "Dos rectas que se cruzan",
    "category": "Geometría",
    "topic": "Geometría analítica y espacio",
    "level": "Reto",
    "statement": "Sean \\(r=(t,0,0)\\) y \\(s=(0,1,1)+u(0,1,0)\\). Demuestra que son alabeadas y calcula su distancia.",
    "resources": [
      {
        "label": "Determinantes",
        "route": "/articles/matrix-determinant",
        "activity": "El producto mixto permite comprobar coplanaridad de dos direcciones y un vector que una sus rectas. Es una aplicación geométrica de los determinantes."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
