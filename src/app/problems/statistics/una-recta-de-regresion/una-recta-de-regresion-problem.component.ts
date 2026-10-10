import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-recta-de-regresion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-recta-de-regresion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaRectaDeRegresionProblemComponent {
  static readonly title = "Una recta de regresión";
  static readonly route = "problema-083";
  static readonly problem: PracticeProblem = {
    "id": "problema-083",
    "number": 83,
    "title": "Una recta de regresión",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Descriptiva y regresión",
    "level": "Oposición",
    "statement": "Para los puntos \\((1,2),(2,2),(3,5)\\), halla la recta de mínimos cuadrados y el coeficiente de correlación de Pearson.",
    "resources": [
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "Lectura de ampliación sobre variabilidad muestral. La recta y la correlación de este ejercicio se calculan directamente con sumas centradas, sin usar el teorema central del límite."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
