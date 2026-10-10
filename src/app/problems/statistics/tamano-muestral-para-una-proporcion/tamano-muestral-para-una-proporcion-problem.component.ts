import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-tamano-muestral-para-una-proporcion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './tamano-muestral-para-una-proporcion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TamanoMuestralParaUnaProporcionProblemComponent {
  static readonly title = "Tamaño muestral para una proporción";
  static readonly route = "problema-089";
  static readonly problem: PracticeProblem = {
    "id": "problema-089",
    "number": 89,
    "title": "Tamaño muestral para una proporción",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Inferencia y muestreo",
    "level": "Oposición",
    "statement": "Usando la aproximación normal, busca n para estimar una proporción con margen máximo \\(0,05\\) al 95 %, sin conocer previamente p. Usa \\(z=1,96\\).",
    "resources": [
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "Una proporción muestral es una media de indicadores Bernoulli. Su aproximación normal conecta con la distribución de medias muestrales."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
