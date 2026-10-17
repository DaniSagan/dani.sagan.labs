import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-el-premio-esperado-de-una-rifa-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './el-premio-esperado-de-una-rifa-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ElPremioEsperadoDeUnaRifaProblemComponent {
  static readonly title = "El premio esperado de una rifa";
  static readonly route = 'problema-177';
  static readonly problem: PracticeProblem = {
  "id": "problema-177",
  "number": 177,
  "title": "El premio esperado de una rifa",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Repaso",
  "statement": "Una rifa tiene 100 boletos equiprobables: uno paga 50 euros, cuatro pagan 10 euros y los demás cero. Un boleto cuesta 2 euros. Calcula la ganancia neta esperada.",
  "resources": [
    {
      "label": "Esperanza discreta, juegos justos y riesgo",
      "route": "/articles/discrete-expectation",
      "activity": "Practica el premio esperado de una rifa. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
