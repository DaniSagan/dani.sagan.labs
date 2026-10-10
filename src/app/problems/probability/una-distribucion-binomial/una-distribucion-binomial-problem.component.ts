import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-distribucion-binomial-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-distribucion-binomial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDistribucionBinomialProblemComponent {
  static readonly title = "Una distribución binomial";
  static readonly route = "problema-076";
  static readonly problem: PracticeProblem = {
    "id": "problema-076",
    "number": 76,
    "title": "Una distribución binomial",
    "category": "Probabilidad",
    "topic": "Variables aleatorias",
    "level": "Repaso",
    "statement": "Se lanzan 5 monedas equilibradas e independientes. Si X es el número de caras, calcula \\(P(X=3)\\), \\(E(X)\\) y \\(\\operatorname{Var}(X)\\).",
    "resources": [
      {
        "label": "Tablero de Galton",
        "route": "/articles/galton-board",
        "activity": "La distribución de resultados de una sucesión de decisiones aleatorias y su representación."
      },
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
