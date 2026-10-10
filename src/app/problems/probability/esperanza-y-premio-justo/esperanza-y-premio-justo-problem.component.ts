import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-esperanza-y-premio-justo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './esperanza-y-premio-justo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EsperanzaYPremioJustoProblemComponent {
  static readonly title = "Esperanza y premio justo";
  static readonly route = "problema-079";
  static readonly problem: PracticeProblem = {
    "id": "problema-079",
    "number": 79,
    "title": "Esperanza y premio justo",
    "category": "Probabilidad",
    "topic": "Variables aleatorias",
    "level": "Oposición",
    "statement": "Un juego cuesta 4 € y paga, antes de descontar la entrada, 10 € si un dado da 6, 5 € si da 5 y 0 € en otro caso. Calcula la ganancia esperada y la entrada justa.",
    "resources": [
      {
        "label": "Tablero de Galton",
        "route": "/articles/galton-board",
        "activity": "La distribución de resultados de una sucesión de decisiones aleatorias y su representación."
      },
      {
        "label": "Laboratorio de probabilidad",
        "route": "/tools/probability-lab",
        "activity": "Simula experimentos de los ejercicios «Dos dados y una condición», «Extracción sin reemplazo», «Una distribución binomial» y compara frecuencias con probabilidades exactas."
      }
    ]
  };
}
