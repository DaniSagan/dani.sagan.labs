import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-solido-al-girar-una-recta-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-solido-al-girar-una-recta-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnSolidoAlGirarUnaRectaProblemComponent {
  static readonly title = "Un sólido al girar una recta";
  static readonly route = 'problema-166';
  static readonly problem: PracticeProblem = {
  "id": "problema-166",
  "number": 166,
  "title": "Un sólido al girar una recta",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Repaso",
  "statement": "Gira la región bajo y=x, entre x=0 y x=2, alrededor del eje horizontal y calcula su volumen.",
  "resources": [
    {
      "label": "Áreas entre curvas y sólidos de revolución",
      "route": "/articles/areas-revolution",
      "activity": "Practica un sólido al girar una recta. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
