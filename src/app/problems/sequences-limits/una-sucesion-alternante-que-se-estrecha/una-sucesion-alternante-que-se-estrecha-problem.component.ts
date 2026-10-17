import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-sucesion-alternante-que-se-estrecha-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-sucesion-alternante-que-se-estrecha-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSucesionAlternanteQueSeEstrechaProblemComponent {
  static readonly title = "Una sucesión alternante que se estrecha";
  static readonly route = 'problema-143';
  static readonly problem: PracticeProblem = {
  "id": "problema-143",
  "number": 143,
  "title": "Una sucesión alternante que se estrecha",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Repaso",
  "statement": "Demuestra que aₙ=(−1)ⁿ/(n+1) converge y encuentra su límite.",
  "resources": [
    {
      "label": "Teorema del encaje y funciones oscilantes",
      "route": "/articles/squeeze-oscillation",
      "activity": "Practica una sucesión alternante que se estrecha. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
