import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-paso-de-newton-para-una-raiz-cubica-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-paso-de-newton-para-una-raiz-cubica-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnPasoDeNewtonParaUnaRaizCubicaProblemComponent {
  static readonly title = "Un paso de Newton para una raíz cúbica";
  static readonly route = 'problema-157';
  static readonly problem: PracticeProblem = {
  "id": "problema-157",
  "number": 157,
  "title": "Un paso de Newton para una raíz cúbica",
  "category": "Cálculo diferencial y optimización",
  "topic": "Optimización y modelos",
  "level": "Repaso",
  "statement": "Usa dos pasos de Newton desde x₀=2 para aproximar la solución positiva de x³=10.",
  "resources": [
    {
      "label": "Método de Newton–Raphson",
      "route": "/articles/newton-raphson",
      "activity": "Practica un paso de Newton para una raíz cúbica. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
