import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-paradoja-de-agregacion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-paradoja-de-agregacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaParadojaDeAgregacionProblemComponent {
  static readonly title = "Una paradoja de agregación";
  static readonly route = "problema-084";
  static readonly problem: PracticeProblem = {
    "id": "problema-084",
    "number": 84,
    "title": "Una paradoja de agregación",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Descriptiva y regresión",
    "level": "Oposición",
    "statement": "El tratamiento A cura 9 de 10 casos leves y 30 de 100 graves. B cura 80 de 100 leves y 2 de 10 graves. Compara las tasas por gravedad y globales.",
    "resources": [
      {
        "label": "Teorema de Bayes",
        "route": "/articles/bayes-theorem",
        "activity": "Condicionar por gravedad modifica las proporciones de los grupos; el teorema de probabilidad total ayuda a entender las ponderaciones de las tasas agregadas."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
