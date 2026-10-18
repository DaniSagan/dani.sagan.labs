import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-transformacion-de-medidas-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './transformacion-de-medidas-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TransformacionDeMedidasProblemComponent {
  static readonly title = "Transformación de medidas";
  static readonly route = "transforming-measurements";
  static readonly problem: PracticeProblem = {
  "id": "problema-082",
  "route": "transforming-measurements",
  "number": 82,
  "title": "Transformación de medidas",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Repaso",
  "statement": "Un conjunto de temperaturas en °C tiene media 20 y desviación típica 3. Convierte su media, desviación típica y varianza a °F, usando \\(F=1,8C+32\\).",
  "resources": [
    {
      "label": "Transformaciones de variables y de sus momentos",
      "route": "/articles/moment-transformations",
      "activity": "Transforma media y dispersión con sus factores correctos y revisa las covarianzas antes de calcular la varianza de una media."
    },
    {
      "label": "Estadística descriptiva y valores atípicos",
      "route": "/articles/descriptive-statistics",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Densidad, esperanza y varianza",
      "route": "/articles/continuous-random-variables",
      "activity": "Normaliza la densidad, calcula áreas y momentos, y observa cómo los cambios de escala transforman media y varianza."
    },
    {
      "label": "Teorema central del límite",
      "route": "/articles/central-limit-theorem",
      "activity": "Los cambios de escala de la media y de su dispersión también aparecen al estandarizar variables para estudiar medias muestrales."
    },
    {
      "label": "Covarianza, dependencia y varianza de una suma",
      "route": "/articles/covariance",
      "activity": "Incluye las covarianzas al transformar o sumar variables y distingue incorrelación de independencia."
    },
    {
      "label": "Análisis dimensional y leyes de escala",
      "route": "/articles/dimensional-analysis",
      "activity": "Comprueba unidades y leyes de escala antes de interpretar transformaciones geométricas o físicas."
    }
  ]
};
}
