import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-escalar-longitudes-areas-y-volumenes-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './escalar-longitudes-areas-y-volumenes-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EscalarLongitudesAreasYVolumenesProblemComponent {
  static readonly title = "Escalar longitudes, áreas y volúmenes";
  static readonly route = "scaling-length-area-and-volume";
  static readonly problem: PracticeProblem = {
  "id": "problema-124",
  "route": "scaling-length-area-and-volume",
  "number": 124,
  "title": "Escalar longitudes, áreas y volúmenes",
  "category": "Geometría",
  "topic": "Triángulos y áreas",
  "level": "Repaso",
  "statement": "Un modelo sólido tiene arista característica 4 cm, área total 60 cm² y volumen 20 cm³. Se amplía por semejanza hasta una arista de 10 cm. Halla área y volumen nuevos.",
  "resources": [
    {
      "label": "Homotecia",
      "route": "/articles/homothety",
      "activity": "Practica escalar longitudes, áreas y volúmenes. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Análisis dimensional",
      "route": "/articles/dimensional-analysis",
      "activity": "Iguala los exponentes de las dimensiones y distingue escala de constante física."
    }
  ]
};
}
