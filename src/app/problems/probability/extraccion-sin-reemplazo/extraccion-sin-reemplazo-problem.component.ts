import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-extraccion-sin-reemplazo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './extraccion-sin-reemplazo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ExtraccionSinReemplazoProblemComponent {
  static readonly title = "Extracción sin reemplazo";
  static readonly route = "problema-072";
  static readonly problem: PracticeProblem = {
  "id": "problema-072",
  "number": 72,
  "title": "Extracción sin reemplazo",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Oposición",
  "statement": "Una urna contiene 5 bolas rojas y 3 azules. Se extraen 3 sin reemplazo. Calcula la probabilidad de obtener exactamente 2 rojas.",
  "resources": [
    {
      "label": "Distribución hipergeométrica",
      "route": "/articles/hypergeometric-distribution",
      "activity": "Calcula probabilidades de extracción sin reemplazo, identifica el soporte y contrasta su varianza con la binomial."
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
      "label": "Principios de conteo: suma, producto y elecciones",
      "route": "/articles/counting-principles",
      "activity": "Define si el orden importa y si se permite repetición antes de construir el espacio de elecciones."
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
