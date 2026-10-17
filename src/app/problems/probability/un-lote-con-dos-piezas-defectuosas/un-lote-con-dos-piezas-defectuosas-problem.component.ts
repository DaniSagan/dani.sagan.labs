import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-lote-con-dos-piezas-defectuosas-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-lote-con-dos-piezas-defectuosas-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnLoteConDosPiezasDefectuosasProblemComponent {
  static readonly title = "Un lote con dos piezas defectuosas";
  static readonly route = 'problema-175';
  static readonly problem: PracticeProblem = {
  "id": "problema-175",
  "number": 175,
  "title": "Un lote con dos piezas defectuosas",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Repaso",
  "statement": "Un lote de 8 piezas contiene 2 defectuosas. Se eligen 3 sin reposición, uniformemente entre todos los subconjuntos. Calcula la probabilidad de exactamente una defectuosa.",
  "resources": [
    {
      "label": "Distribución hipergeométrica: extracción sin reemplazo",
      "route": "/articles/hypergeometric-distribution",
      "activity": "Practica un lote con dos piezas defectuosas. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Árboles de probabilidad y experimentos por etapas",
      "route": "/articles/probability-trees",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
