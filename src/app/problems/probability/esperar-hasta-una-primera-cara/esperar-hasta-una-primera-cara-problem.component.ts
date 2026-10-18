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
  static readonly route = "waiting-for-first-head";
  static readonly problem: PracticeProblem = {
  "id": "problema-176",
  "route": "waiting-for-first-head",
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
    },
    {
      "label": "Función de distribución, colas y probabilidades acumuladas",
      "route": "/articles/distribution-functions-tails",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Distingue restringir el espacio de resultados, multiplicar probabilidades y sumar casos disjuntos."
    }
  ]
};
}
