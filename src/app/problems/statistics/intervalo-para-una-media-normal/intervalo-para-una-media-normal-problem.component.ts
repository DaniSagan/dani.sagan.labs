import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-intervalo-para-una-media-normal-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './intervalo-para-una-media-normal-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class IntervaloParaUnaMediaNormalProblemComponent {
  static readonly title = "Intervalo para una media normal";
  static readonly route = "problema-087";
  static readonly problem: PracticeProblem = {
    "id": "problema-087",
    "number": 87,
    "title": "Intervalo para una media normal",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Inferencia y muestreo",
    "level": "Oposición",
    "statement": "Una población normal tiene desviación típica conocida \\(\\sigma =10\\). Una muestra independiente de \\(n=100\\) da media 50. Usando \\(z_{0},_{975}=1,96\\), calcula el intervalo de confianza del 95% para la media e interpreta su cobertura.",
    "resources": [
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "Lectura complementaria sobre medias muestrales, dispersión e inferencia a partir de muestras."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
