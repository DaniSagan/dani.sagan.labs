import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-cola-de-serie-telescopica-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-cola-de-serie-telescopica-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaColaDeSerieTelescopicaProblemComponent {
  static readonly title = "Una cola de serie telescópica";
  static readonly route = "telescoping-series-tail";
  static readonly problem: PracticeProblem = {
  "id": "problema-145",
  "route": "telescoping-series-tail",
  "number": 145,
  "title": "Una cola de serie telescópica",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Repaso",
  "statement": "Calcula la suma desde n=1 hasta infinito de 1/((n+1)(n+2)) y el error tras N términos.",
  "resources": [
    {
      "label": "Series telescópicas",
      "route": "/articles/telescoping-series",
      "activity": "Practica una cola de serie telescópica. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Descomposición en fracciones parciales",
      "route": "/articles/integration-classical",
      "fragment": "rational",
      "activity": "Compara coeficientes después de reunir denominadores y conserva el dominio."
    },
    {
      "label": "Equivalencias y órdenes de crecimiento",
      "route": "/articles/asymptotic-limits",
      "activity": "Compara los términos dominantes y controla el error tras cancelar."
    }
  ]
};
}
