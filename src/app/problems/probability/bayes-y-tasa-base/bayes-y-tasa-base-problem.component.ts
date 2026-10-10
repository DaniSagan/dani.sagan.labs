import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-bayes-y-tasa-base-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './bayes-y-tasa-base-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class BayesYTasaBaseProblemComponent {
  static readonly title = "Bayes y tasa base";
  static readonly route = "problema-073";
  static readonly problem: PracticeProblem = {
    "id": "problema-073",
    "number": 73,
    "title": "Bayes y tasa base",
    "category": "Probabilidad",
    "topic": "Conteo y probabilidad condicionada",
    "level": "Oposición",
    "statement": "Un detector marca el 90% de las piezas defectuosas y el 5% de las correctas. El 2% de las piezas son defectuosas. Si marca una pieza, ¿qué probabilidad hay de que sea defectuosa?",
    "resources": [
      {
        "label": "Teorema de Bayes",
        "route": "/articles/bayes-theorem",
        "activity": "Probabilidades condicionadas, probabilidades totales e inversión de la condición."
      },
      {
        "label": "Laboratorio de probabilidad",
        "route": "/tools/probability-lab",
        "activity": "Simula experimentos de los ejercicios «Dos dados y una condición», «Extracción sin reemplazo», «Una distribución binomial» y compara frecuencias con probabilidades exactas."
      }
    ]
  };
}
