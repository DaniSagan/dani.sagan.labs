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
  static readonly route = "two-sided-hypothesis-test";
  static readonly problem: PracticeProblem = {
  "id": "problema-088",
  "route": "two-sided-hypothesis-test",
  "number": 88,
  "title": "Contraste bilateral",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Inferencia y muestreo",
  "level": "Oposición",
  "statement": "Con población normal y \\(\\sigma =10\\) conocida, contrasta \\(H_{0}\\):\\(\\mu =50\\) frente a \\(H_{1}\\):\\(\\mu \\ne 50\\). Una muestra de \\(n=100\\) da media 52. Usa nivel 5% y valor crítico \\(1,96\\).",
  "resources": [
    {
      "label": "Distribución normal y tipificación",
      "route": "/articles/normal-distribution",
      "activity": "Tipifica con el error estándar adecuado, distingue colas unilaterales y bilaterales e interpreta cobertura y p-valor."
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
      "label": "Distribuciones t de Student y chi-cuadrado",
      "route": "/articles/student-chi-square",
      "activity": "Revisa cuándo la estimación de dispersión exige Student o chi-cuadrado y sus grados de libertad."
    },
    {
      "label": "Potencia estadística y errores de contraste",
      "route": "/articles/statistical-power",
      "activity": "Planifica un efecto relevante y compara nivel, error de tipo II y potencia para distintos tamaños."
    },
    {
      "label": "Distribución de la media y error estándar",
      "route": "/articles/sampling-distributions",
      "activity": "Separa la dispersión de las observaciones de la dispersión de su media."
    }
  ]
};
}
