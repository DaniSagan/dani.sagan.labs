import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-media-y-varianza-descriptiva-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './media-y-varianza-descriptiva-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class MediaYVarianzaDescriptivaProblemComponent {
  static readonly title = "Media y varianza descriptiva";
  static readonly route = "problema-081";
  static readonly problem: PracticeProblem = {
    "id": "problema-081",
    "number": 81,
    "title": "Media y varianza descriptiva",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Descriptiva y regresión",
    "level": "Repaso",
    "statement": "Para los datos \\(2,4,4,6\\), calcula media, mediana, varianza descriptiva con divisor n y varianza muestral con divisor \\(n-1\\).",
    "resources": [
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "La media y la varianza descriptivas son el punto de partida para estudiar cómo varían las medias de muestras repetidas."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
