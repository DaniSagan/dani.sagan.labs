import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-precision-de-una-media-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './precision-de-una-media-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class PrecisionDeUnaMediaProblemComponent {
  static readonly title = "Precisión de una media";
  static readonly route = "problema-086";
  static readonly problem: PracticeProblem = {
    "id": "problema-086",
    "number": 86,
    "title": "Precisión de una media",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Inferencia y muestreo",
    "level": "Oposición",
    "statement": "Una población tiene varianza 36. Para muestras independientes de tamaño n, calcula \\(\\operatorname{Var}(\\bar{X})\\). ¿Qué n hace que la desviación típica de X̄ sea como máximo \\(\\frac{1}{2}\\)?",
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
