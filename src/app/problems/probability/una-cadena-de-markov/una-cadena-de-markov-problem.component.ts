import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-cadena-de-markov-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-cadena-de-markov-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaCadenaDeMarkovProblemComponent {
  static readonly title = "Una cadena de Markov";
  static readonly route = "problema-080";
  static readonly problem: PracticeProblem = {
    "id": "problema-080",
    "number": 80,
    "title": "Una cadena de Markov",
    "category": "Probabilidad",
    "topic": "Variables aleatorias",
    "level": "Reto",
    "statement": "Una máquina pasa de operativa a averiada con probabilidad \\(\\frac{1}{10}\\) por día y de averiada a operativa con probabilidad \\(\\frac{3}{5}\\). Halla la distribución estacionaria y la probabilidad de estar operativa dentro de dos días si hoy lo está.",
    "resources": [
      {
        "label": "Cadenas de Markov",
        "route": "/articles/markov-chains",
        "activity": "Estados, transiciones y evolución de distribuciones en procesos discretos."
      },
      {
        "label": "Laboratorio de probabilidad",
        "route": "/tools/probability-lab",
        "activity": "Simula experimentos de los ejercicios «Dos dados y una condición», «Extracción sin reemplazo», «Una distribución binomial» y compara frecuencias con probabilidades exactas."
      }
    ]
  };
}
