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
  static readonly route = 'problema-173';
  static readonly problem: PracticeProblem = {
  "id": "problema-173",
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
    }
  ]
};
}
