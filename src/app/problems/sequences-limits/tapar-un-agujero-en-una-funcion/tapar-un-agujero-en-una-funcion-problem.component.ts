import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-tapar-un-agujero-en-una-funcion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './tapar-un-agujero-en-una-funcion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TaparUnAgujeroEnUnaFuncionProblemComponent {
  static readonly title = "Tapar un agujero en una función";
  static readonly route = "removable-discontinuity";
  static readonly problem: PracticeProblem = {
  "id": "problema-147",
  "route": "removable-discontinuity",
  "number": 147,
  "title": "Tapar un agujero en una función",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Repaso",
  "statement": "Sea f(x)=(x²−9)/(x−3) para x≠3 y f(3)=k. Determina k para que sea continua en 3.",
  "resources": [
    {
      "label": "Continuidad y derivabilidad: funciones a trozos",
      "route": "/articles/continuity-differentiability",
      "activity": "Practica tapar un agujero en una función. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Identidades notables y factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Desarrolla o agrupa términos para justificar la factorización utilizada."
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
