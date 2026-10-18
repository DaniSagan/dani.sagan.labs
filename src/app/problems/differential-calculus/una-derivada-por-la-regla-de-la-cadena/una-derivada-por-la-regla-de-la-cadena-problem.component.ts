import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-derivada-por-la-regla-de-la-cadena-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-derivada-por-la-regla-de-la-cadena-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDerivadaPorLaReglaDeLaCadenaProblemComponent {
  static readonly title = "Una derivada por la regla de la cadena";
  static readonly route = "chain-rule-derivative";
  static readonly problem: PracticeProblem = {
  "id": "problema-153",
  "route": "chain-rule-derivative",
  "number": 153,
  "title": "Una derivada por la regla de la cadena",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Deriva g(x)=(3x²+1)⁴ y calcula g′(1).",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Practica una derivada por la regla de la cadena. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Dominio y transformaciones equivalentes",
      "route": "/articles/equation-equivalence",
      "fragment": "domain",
      "activity": "Conserva las exclusiones al cancelar o multiplicar y comprueba las soluciones obtenidas."
    }
  ]
};
}
