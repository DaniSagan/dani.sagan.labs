import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-esperar-hasta-una-primera-cara-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './esperar-hasta-una-primera-cara-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EsperarHastaUnaPrimeraCaraProblemComponent {
  static readonly title = "Esperar hasta una primera cara";
  static readonly route = 'problema-176';
  static readonly problem: PracticeProblem = {
  "id": "problema-176",
  "number": 176,
  "title": "Esperar hasta una primera cara",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Repaso",
  "statement": "Se lanza una moneda equilibrada e independiente hasta la primera cara. Calcula la probabilidad de necesitar exactamente cuatro lanzamientos y la de necesitar más de cuatro.",
  "resources": [
    {
      "label": "Distribución geométrica y tiempo de espera",
      "route": "/articles/geometric-distribution",
      "activity": "Practica esperar hasta una primera cara. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
