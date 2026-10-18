import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-el-error-estandar-de-un-promedio-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './el-error-estandar-de-un-promedio-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ElErrorEstandarDeUnPromedioProblemComponent {
  static readonly title = "El error estándar de un promedio";
  static readonly route = "standard-error-of-an-average";
  static readonly problem: PracticeProblem = {
  "id": "problema-187",
  "route": "standard-error-of-an-average",
  "number": 187,
  "title": "El error estándar de un promedio",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Inferencia y muestreo",
  "level": "Repaso",
  "statement": "Se promedian 64 mediciones independientes de una población con media 10 y desviación típica 4. Calcula la media y desviación típica del promedio.",
  "resources": [
    {
      "label": "Distribuciones muestrales y error estándar",
      "route": "/articles/sampling-distributions",
      "activity": "Practica el error estándar de un promedio. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Transformaciones de medias y varianzas",
      "route": "/articles/moment-transformations",
      "activity": "El desplazamiento afecta a la media y la escala entra al cuadrado en la varianza."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Distingue restringir el espacio de resultados, multiplicar probabilidades y sumar casos disjuntos."
    },
    {
      "label": "Esperanza, ganancia neta y varianza discreta",
      "route": "/articles/discrete-expectation",
      "activity": "Pondera cada valor por su probabilidad y descuenta los costes ciertos."
    }
  ]
};
}
