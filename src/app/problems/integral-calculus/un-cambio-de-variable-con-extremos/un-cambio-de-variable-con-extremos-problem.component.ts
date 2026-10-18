import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-cambio-de-variable-con-extremos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-cambio-de-variable-con-extremos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnCambioDeVariableConExtremosProblemComponent {
  static readonly title = "Un cambio de variable con extremos";
  static readonly route = "substitution-with-integration-bounds";
  static readonly problem: PracticeProblem = {
  "id": "problema-163",
  "route": "substitution-with-integration-bounds",
  "number": 163,
  "title": "Un cambio de variable con extremos",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Repaso",
  "statement": "Calcula la integral de 2x(x²+1)³ entre x=0 y x=1.",
  "resources": [
    {
      "label": "Integrales I: técnicas clásicas",
      "route": "/articles/integration-classical",
      "activity": "Practica un cambio de variable con extremos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
    }
  ]
};
}
