import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-media-y-varianza-descriptiva-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './media-y-varianza-descriptiva-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class MediaYVarianzaDescriptivaProblemComponent {
  static readonly title = "Media y varianza descriptiva";
  static readonly route = "problema-081";
  static readonly problem: PracticeProblem = {
    "id": "problema-081",
    "number": 81,
    "title": "Media y varianza descriptiva",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Descriptiva y regresión",
    "level": "Repaso",
    "statement": "Para los datos \\(2,4,4,6\\), calcula media, mediana, varianza descriptiva con divisor n y varianza muestral con divisor \\(n-1\\).",
    "resources": [
      {
        "label": "Estadística descriptiva y valores atípicos",
        "route": "/articles/descriptive-statistics",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Corrección de Bessel y estimadores insesgados",
        "route": "/articles/bessel-correction",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "La media y la varianza descriptivas son el punto de partida para estudiar cómo varían las medias de muestras repetidas."
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
