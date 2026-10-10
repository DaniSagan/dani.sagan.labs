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
  static readonly route = "problema-082";
  static readonly problem: PracticeProblem = {
    "id": "problema-082",
    "number": 82,
    "title": "Transformación de medidas",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Descriptiva y regresión",
    "level": "Repaso",
    "statement": "Un conjunto de temperaturas en °C tiene media 20 y desviación típica 3. Convierte su media, desviación típica y varianza a °F, usando \\(F=1,8C+32\\).",
    "resources": [
      {
        "label": "Teorema central del límite",
        "route": "/articles/central-limit-theorem",
        "activity": "Los cambios de escala de la media y de su dispersión también aparecen al estandarizar variables para estudiar medias muestrales."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
