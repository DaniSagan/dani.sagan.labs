import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-tangente-desde-un-punto-exterior-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-tangente-desde-un-punto-exterior-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaTangenteDesdeUnPuntoExteriorProblemComponent {
  static readonly title = "Una tangente desde un punto exterior";
  static readonly route = 'problema-130';
  static readonly problem: PracticeProblem = {
  "id": "problema-130",
  "number": 130,
  "title": "Una tangente desde un punto exterior",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Repaso",
  "statement": "Una circunferencia tiene centro O y radio 5. P está a distancia 13 de O. Calcula la longitud del segmento tangente PT.",
  "resources": [
    {
      "label": "Teoremas de cuerdas, secantes y tangentes",
      "route": "/articles/chords-secants-tangents",
      "activity": "Practica una tangente desde un punto exterior. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
