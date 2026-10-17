import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-funcion-oscilante-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-funcion-oscilante-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaFuncionOscilanteProblemComponent {
  static readonly title = "Una función oscilante";
  static readonly route = "problema-049";
  static readonly problem: PracticeProblem = {
  "id": "problema-049",
  "number": 49,
  "title": "Una función oscilante",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Oposición",
  "statement": "Define \\(f(0)=0\\) y \\(f(x)=x \\sin(1/x)\\) para x≠0. Estudia continuidad y derivabilidad en 0.",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Teorema del encaje y funciones oscilantes",
      "route": "/articles/squeeze-oscillation",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Continuidad y derivabilidad",
      "route": "/articles/continuity-differentiability",
      "activity": "Compara límites laterales y cocientes incrementales; distingue continuidad, derivabilidad y continuidad de la derivada."
    },
    {
      "label": "Series de Taylor",
      "route": "/articles/taylor-series",
      "activity": "La oscilación impide la derivada en cero. Como contraste, las expansiones de Taylor requieren las condiciones de regularidad explicadas en este artículo."
    },
    {
      "label": "Representador de funciones",
      "route": "/tools/graph-plotter",
      "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
    },
    {
      "label": "Valor absoluto: distancias y funciones a trozos",
      "route": "/articles/absolute-value-distance",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
