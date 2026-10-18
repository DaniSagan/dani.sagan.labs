import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-minimo-con-dominio-abierto-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-minimo-con-dominio-abierto-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnMinimoConDominioAbiertoProblemComponent {
  static readonly title = "Un mínimo con dominio abierto";
  static readonly route = "minimum-on-an-open-domain";
  static readonly problem: PracticeProblem = {
  "id": "problema-154",
  "route": "minimum-on-an-open-domain",
  "number": 154,
  "title": "Un mínimo con dominio abierto",
  "category": "Cálculo diferencial y optimización",
  "topic": "Optimización y modelos",
  "level": "Repaso",
  "statement": "Encuentra el mínimo global de f(x)=x+9/x para x>0.",
  "resources": [
    {
      "label": "Optimización con derivadas",
      "route": "/articles/derivative-optimization",
      "activity": "Practica un mínimo con dominio abierto. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Extremos globales y teorema de Weierstrass",
      "route": "/articles/global-extrema-weierstrass",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
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
