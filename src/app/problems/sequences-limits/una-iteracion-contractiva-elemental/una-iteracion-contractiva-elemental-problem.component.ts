import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-iteracion-contractiva-elemental-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-iteracion-contractiva-elemental-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIteracionContractivaElementalProblemComponent {
  static readonly title = "Una iteración contractiva elemental";
  static readonly route = 'problema-150';
  static readonly problem: PracticeProblem = {
  "id": "problema-150",
  "number": 150,
  "title": "Una iteración contractiva elemental",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Repaso",
  "statement": "Con x₀=0 y xₙ₊₁=(xₙ+6)/4, encuentra el límite y un índice que asegure error menor que 0,001.",
  "resources": [
    {
      "label": "Teorema del punto fijo de Banach",
      "route": "/articles/banach-fixed-point",
      "activity": "Practica una iteración contractiva elemental. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
