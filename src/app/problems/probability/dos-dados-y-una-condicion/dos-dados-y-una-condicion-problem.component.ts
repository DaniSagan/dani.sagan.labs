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
      "label": "Probabilidad en espacios finitos: sucesos y regla de Laplace",
      "route": "/articles/finite-probability",
      "activity": "Define los resultados elementales, justifica su equiprobabilidad y cuenta la intersección antes de condicionar o comprobar independencia."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
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
    },
    {
      "label": "Principio de inclusión y exclusión",
      "route": "/articles/inclusion-exclusion",
      "activity": "Corrige el doble conteo de propiedades que se solapan mediante sus intersecciones."
    },
    {
      "label": "Árboles de probabilidad y experimentos por etapas",
      "route": "/articles/probability-trees",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
