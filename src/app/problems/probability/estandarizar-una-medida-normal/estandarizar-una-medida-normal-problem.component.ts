import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-estandarizar-una-medida-normal-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './estandarizar-una-medida-normal-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EstandarizarUnaMedidaNormalProblemComponent {
  static readonly title = "Estandarizar una medida normal";
  static readonly route = 'problema-179';
  static readonly problem: PracticeProblem = {
  "id": "problema-179",
  "number": 179,
  "title": "Estandarizar una medida normal",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Repaso",
  "statement": "Una variable normal tiene media 100 y desviación típica 15. Expresa P(85≤X≤130) mediante la normal estándar y usa Φ(2)=0,97725, Φ(−1)=0,15866.",
  "resources": [
    {
      "label": "Distribución normal y tipificación",
      "route": "/articles/normal-distribution",
      "activity": "Practica estandarizar una medida normal. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
