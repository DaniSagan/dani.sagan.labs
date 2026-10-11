import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-tiempo-hasta-el-primer-exito-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './tiempo-hasta-el-primer-exito-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TiempoHastaElPrimerExitoProblemComponent {
  static readonly title = "Tiempo hasta el primer éxito";
  static readonly route = "problema-077";
  static readonly problem: PracticeProblem = {
    "id": "problema-077",
    "number": 77,
    "title": "Tiempo hasta el primer éxito",
    "category": "Probabilidad",
    "topic": "Variables aleatorias",
    "level": "Oposición",
    "statement": "Ensayos independientes tienen éxito con probabilidad \\(\\frac{1}{4}\\). Sea X el número de ensayos hasta el primer éxito, incluido este. Calcula \\(P(X>3)\\) y \\(E(X)\\).",
    "resources": [
{
  "label": "Esperanza discreta, juegos justos y riesgo",
  "route": "/articles/discrete-expectation",
  "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
},
      {
        "label": "Distribución geométrica y tiempo de espera",
        "route": "/articles/geometric-distribution",
        "activity": "Calcula la cola y la esperanza hasta el primer éxito y comprueba la falta de memoria bajo ensayos independientes."
      },
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
