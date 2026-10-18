import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-al-menos-un-seis-en-tres-tiradas-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './al-menos-un-seis-en-tres-tiradas-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class AlMenosUnSeisEnTresTiradasProblemComponent {
  static readonly title = "Al menos un seis en tres tiradas";
  static readonly route = "at-least-one-six-in-three-rolls";
  static readonly problem: PracticeProblem = {
  "id": "problema-173",
  "route": "at-least-one-six-in-three-rolls",
  "number": 173,
  "title": "Al menos un seis en tres tiradas",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Repaso",
  "statement": "Se lanza un dado equilibrado tres veces de forma independiente. Calcula la probabilidad de obtener al menos un seis.",
  "resources": [
    {
      "label": "Distribuciones de Bernoulli y binomial",
      "route": "/articles/bernoulli-binomial",
      "activity": "Practica al menos un seis en tres tiradas. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Árboles de probabilidad y experimentos por etapas",
      "route": "/articles/probability-trees",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Función de distribución, colas y probabilidades acumuladas",
      "route": "/articles/distribution-functions-tails",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Espacio muestral, sucesos y complemento",
      "route": "/articles/finite-probability",
      "activity": "Cuenta solo resultados equiprobables y distingue unión, intersección y complemento."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Distingue restringir el espacio de resultados, multiplicar probabilidades y sumar casos disjuntos."
    },
    {
      "label": "Laboratorio de probabilidad",
      "route": "/tools/probability-lab",
      "activity": "Compara frecuencias simuladas con el valor teórico y observa la variación entre muestras."
    }
  ]
};
}
