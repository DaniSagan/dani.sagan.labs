import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-esfera-inscrita-en-un-cubo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-esfera-inscrita-en-un-cubo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaEsferaInscritaEnUnCuboProblemComponent {
  static readonly title = "Una esfera inscrita en un cubo";
  static readonly route = 'problema-126';
  static readonly problem: PracticeProblem = {
  "id": "problema-126",
  "number": 126,
  "title": "Una esfera inscrita en un cubo",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Repaso",
  "statement": "Un cubo tiene arista 6. Calcula los radios de sus esferas inscrita y circunscrita y su cociente.",
  "resources": [
    {
      "label": "Esferas inscritas y circunscritas",
      "route": "/articles/inspheres-circumspheres",
      "activity": "Practica una esfera inscrita en un cubo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
