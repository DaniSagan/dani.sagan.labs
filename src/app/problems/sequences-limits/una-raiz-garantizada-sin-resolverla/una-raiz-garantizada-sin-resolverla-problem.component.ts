import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-raiz-garantizada-sin-resolverla-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-raiz-garantizada-sin-resolverla-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaRaizGarantizadaSinResolverlaProblemComponent {
  static readonly title = "Una raíz garantizada sin resolverla";
  static readonly route = "root-existence-by-intermediate-value";
  static readonly problem: PracticeProblem = {
  "id": "problema-148",
  "route": "root-existence-by-intermediate-value",
  "number": 148,
  "title": "Una raíz garantizada sin resolverla",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Repaso",
  "statement": "Demuestra que x³+x−1=0 tiene exactamente una raíz en (0,1).",
  "resources": [
    {
      "label": "Teorema de Bolzano: existencia y unicidad de raíces",
      "route": "/articles/bolzano-theorem",
      "activity": "Practica una raíz garantizada sin resolverla. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Cómo demostrar: implicaciones, contradicción y contraposición",
      "route": "/articles/proof-strategies",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
    },
    {
      "label": "Crecimiento, extremos y concavidad",
      "route": "/articles/function-analysis",
      "activity": "Relaciona los signos de las derivadas con el comportamiento de la función."
    },
    {
      "label": "Grado, términos y coeficientes de un polinomio",
      "route": "/articles/polynomial-foundations",
      "fragment": "coefficients",
      "activity": "Identifica los coeficientes, incluye términos ausentes y determina el grado después de simplificar."
    }
  ]
};
}
