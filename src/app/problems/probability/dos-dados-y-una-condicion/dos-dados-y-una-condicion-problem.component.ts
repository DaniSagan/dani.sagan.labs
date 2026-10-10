import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-dados-y-una-condicion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-dados-y-una-condicion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosDadosYUnaCondicionProblemComponent {
  static readonly title = "Dos dados y una condición";
  static readonly route = "problema-071";
  static readonly problem: PracticeProblem = {
    "id": "problema-071",
    "number": 71,
    "title": "Dos dados y una condición",
    "category": "Probabilidad",
    "topic": "Conteo y probabilidad condicionada",
    "level": "Repaso",
    "statement": "Se lanzan dos dados equilibrados. Sea S la suma y A el suceso «el primer dado es par». Calcula \\(P(S=8)\\) y \\(P(S=8\\mid A)\\).",
    "resources": [
      {
        "label": "Teorema del binomio",
        "route": "/articles/binomial-theorem",
        "activity": "Coeficientes combinatorios y expansión de potencias de una suma."
      },
      {
        "label": "Laboratorio de probabilidad",
        "route": "/tools/probability-lab",
        "activity": "Simula experimentos de los ejercicios «Dos dados y una condición», «Extracción sin reemplazo», «Una distribución binomial» y compara frecuencias con probabilidades exactas."
      }
    ]
  };
}
