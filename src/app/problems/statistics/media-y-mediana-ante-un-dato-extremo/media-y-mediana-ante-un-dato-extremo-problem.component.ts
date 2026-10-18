import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-media-y-mediana-ante-un-dato-extremo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './media-y-mediana-ante-un-dato-extremo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class MediaYMedianaAnteUnDatoExtremoProblemComponent {
  static readonly title = "Media y mediana ante un dato extremo";
  static readonly route = "outlier-effect-on-mean-and-median";
  static readonly problem: PracticeProblem = {
  "id": "problema-181",
  "route": "outlier-effect-on-mean-and-median",
  "number": 181,
  "title": "Media y mediana ante un dato extremo",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Repaso",
  "statement": "Calcula media y mediana de 2, 3, 3, 4, 18. Repite al sustituir 18 por 48 y compara.",
  "resources": [
    {
      "label": "Estadística descriptiva y valores atípicos",
      "route": "/articles/descriptive-statistics",
      "activity": "Practica media y mediana ante un dato extremo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Diagramas de dispersión y diagnósticos",
      "route": "/articles/graphical-diagnostics",
      "activity": "Inspecciona la forma de los datos además de sus resúmenes."
    }
  ]
};
}
