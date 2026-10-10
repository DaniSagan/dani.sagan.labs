import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-independencia-de-sucesos-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './independencia-de-sucesos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class IndependenciaDeSucesosProblemComponent {
  static readonly title = "Independencia de sucesos";
  static readonly route = "problema-074";
  static readonly problem: PracticeProblem = {
    "id": "problema-074",
    "number": 74,
    "title": "Independencia de sucesos",
    "category": "Probabilidad",
    "topic": "Conteo y probabilidad condicionada",
    "level": "Oposición",
    "statement": "En un dado equilibrado, \\(A={2,4,6}\\) y \\(B={3,6}\\). Decide si son independientes. Repite con \\(C={4,5,6}\\) en lugar de B.",
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
