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
  static readonly route = "regression-line";
  static readonly problem: PracticeProblem = {
  "id": "problema-083",
  "route": "regression-line",
  "number": 83,
  "title": "Una recta de regresión",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Oposición",
  "statement": "Para los puntos \\((1,2),(2,2),(3,5)\\), halla la recta de mínimos cuadrados y el coeficiente de correlación de Pearson.",
  "resources": [
    {
      "label": "Diagnóstico gráfico: Anscombe, Datasaurus y residuos",
      "route": "/articles/graphical-diagnostics",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Regresión lineal y correlación de Pearson",
      "route": "/articles/linear-regression",
      "activity": "Calcula mínimos cuadrados y Pearson, inspecciona los residuos y compara nubes con resúmenes similares."
    },
    {
      "label": "Teorema central del límite",
      "route": "/articles/central-limit-theorem",
      "activity": "Lectura de ampliación sobre variabilidad muestral. La recta y la correlación de este ejercicio se calculan directamente con sumas centradas, sin usar el teorema central del límite."
    },
    {
      "label": "Productos internos y ortonormalización de Gram–Schmidt",
      "route": "/articles/gram-schmidt",
      "activity": "Construye direcciones ortogonales y conecta sus componentes con productos internos."
    },
    {
      "label": "Proyecciones ortogonales y mínimos cuadrados",
      "route": "/articles/projection-least-squares",
      "activity": "Deduce la proyección mediante ortogonalidad del residuo y relaciónala con un ajuste de mínimos cuadrados."
    },
    {
      "label": "Covarianza, dependencia y varianza de una suma",
      "route": "/articles/covariance",
      "activity": "Incluye las covarianzas al transformar o sumar variables y distingue incorrelación de independencia."
    },
    {
      "label": "Bootstrap y estimación por remuestreo",
      "route": "/articles/bootstrap",
      "activity": "Amplía la estimación de incertidumbre con remuestreo y revisa si el diseño requiere conservar grupos."
    },
    {
      "label": "Derivadas parciales y minimización en varias variables",
      "route": "/articles/partial-derivatives-minimization",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Desigualdad de Cauchy–Schwarz",
      "route": "/articles/cauchy-schwarz",
      "activity": "Comprueba la desigualdad y la condición exacta de igualdad."
    }
  ]
};
}
