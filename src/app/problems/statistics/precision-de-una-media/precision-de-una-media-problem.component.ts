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
        "label": "Distribuciones muestrales y error estándar",
        "route": "/articles/sampling-distributions",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Corrección de Bessel y estimadores insesgados",
        "route": "/articles/bessel-correction",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Inferencia estadística",
        "route": "/articles/statistical-inference",
        "activity": "Distingue error estándar, cobertura y nivel del contraste; planifica tamaños muestrales y comprueba las hipótesis del modelo."
      },
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "Lectura complementaria sobre medias muestrales, dispersión e inferencia a partir de muestras."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      },
      {
        "label": "Ley de los grandes números",
        "route": "/articles/large-numbers-law",
        "activity": "Relaciona promedios y frecuencias con convergencia, independencia y tamaño de muestra."
      },
      {
        "label": "Desigualdades de Markov y Chebyshev",
        "route": "/articles/probability-inequalities",
        "activity": "Obtén garantías de desviación desde media y varianza y compáralas con colas de distribuciones concretas."
      },
      {
        "label": "Covarianza, dependencia y varianza de una suma",
        "route": "/articles/covariance",
        "activity": "Incluye las covarianzas al transformar o sumar variables y distingue incorrelación de independencia."
      },
      {
        "label": "Distribuciones t de Student y chi-cuadrado",
        "route": "/articles/student-chi-square",
        "activity": "Revisa cuándo la estimación de dispersión exige Student o chi-cuadrado y sus grados de libertad."
      },
      {
        "label": "Bootstrap y estimación por remuestreo",
        "route": "/articles/bootstrap",
        "activity": "Amplía la estimación de incertidumbre con remuestreo y revisa si el diseño requiere conservar grupos."
      }
    ]
  };
}
