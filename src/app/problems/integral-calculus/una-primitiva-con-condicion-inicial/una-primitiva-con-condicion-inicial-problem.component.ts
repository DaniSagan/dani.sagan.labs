import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-primitiva-con-condicion-inicial-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-primitiva-con-condicion-inicial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaPrimitivaConCondicionInicialProblemComponent {
  static readonly title = "Una primitiva con condición inicial";
  static readonly route = "antiderivative-with-initial-condition";
  static readonly problem: PracticeProblem = {
  "id": "problema-161",
  "route": "antiderivative-with-initial-condition",
  "number": 161,
  "title": "Una primitiva con condición inicial",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Repaso",
  "statement": "Encuentra F si F′(x)=6x²−4x+1 y F(0)=7.",
  "resources": [
    {
      "label": "Integrales I: técnicas clásicas",
      "route": "/articles/integration-classical",
      "activity": "Practica una primitiva con condición inicial. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
    }
  ]
};
}
