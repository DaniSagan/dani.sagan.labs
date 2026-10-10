import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-contraste-bilateral-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './contraste-bilateral-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ContrasteBilateralProblemComponent {
  static readonly title = "Contraste bilateral";
  static readonly route = "problema-088";
  static readonly problem: PracticeProblem = {
    "id": "problema-088",
    "number": 88,
    "title": "Contraste bilateral",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Inferencia y muestreo",
    "level": "Oposición",
    "statement": "Con población normal y \\(\\sigma =10\\) conocida, contrasta \\(H_{0}\\):\\(\\mu =50\\) frente a \\(H_{1}\\):\\(\\mu \\ne 50\\). Una muestra de \\(n=100\\) da media 52. Usa nivel 5% y valor crítico \\(1,96\\).",
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
