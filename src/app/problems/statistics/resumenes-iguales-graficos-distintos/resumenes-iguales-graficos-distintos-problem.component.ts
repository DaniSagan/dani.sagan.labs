import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-resumenes-iguales-graficos-distintos-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './resumenes-iguales-graficos-distintos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ResumenesIgualesGraficosDistintosProblemComponent {
  static readonly title = "Resúmenes iguales, gráficos distintos";
  static readonly route = "same-summaries-different-plots";
  static readonly problem: PracticeProblem = {
  "id": "problema-085",
  "route": "same-summaries-different-plots",
  "number": 85,
  "title": "Resúmenes iguales, gráficos distintos",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Oposición",
  "statement": "Dos conjuntos tienen la misma media y varianza de x e y y la misma correlación. ¿Implica que sus diagramas de dispersión son iguales o que el mismo modelo lineal es adecuado? Explica cómo lo comprobarías con Datasaurus.",
  "resources": [
    {
      "label": "Diagnóstico gráfico: Anscombe, Datasaurus y residuos",
      "route": "/articles/graphical-diagnostics",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Estadística descriptiva y valores atípicos",
      "route": "/articles/descriptive-statistics",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Regresión lineal y correlación de Pearson",
      "route": "/articles/linear-regression",
      "activity": "Calcula mínimos cuadrados y Pearson, inspecciona los residuos y compara nubes con resúmenes similares."
    },
    {
      "label": "Tablero de Galton",
      "route": "/articles/galton-board",
      "activity": "La representación de la distribución en el tablero de Galton sirve como contraste entre forma gráfica y medidas resumen; no sustituye la inspección de los datos de Datasaurus."
    },
    {
      "label": "Bootstrap y estimación por remuestreo",
      "route": "/articles/bootstrap",
      "activity": "Amplía la estimación de incertidumbre con remuestreo y revisa si el diseño requiere conservar grupos."
    },
    {
      "label": "Covarianza y correlación",
      "route": "/articles/covariance",
      "activity": "Centra los datos y distingue asociación lineal de causalidad."
    }
  ]
};
}
