import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-tamano-muestral-para-una-proporcion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './tamano-muestral-para-una-proporcion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TamanoMuestralParaUnaProporcionProblemComponent {
  static readonly title = "Tamaño muestral para una proporción";
  static readonly route = "sample-size-for-a-proportion";
  static readonly problem: PracticeProblem = {
  "id": "problema-089",
  "route": "sample-size-for-a-proportion",
  "number": 89,
  "title": "Tamaño muestral para una proporción",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Inferencia y muestreo",
  "level": "Oposición",
  "statement": "Usando la aproximación normal, busca n para estimar una proporción con margen máximo \\(0,05\\) al 95 %, sin conocer previamente p. Usa \\(z=1,96\\).",
  "resources": [
    {
      "label": "Distribución normal y tipificación",
      "route": "/articles/normal-distribution",
      "activity": "Tipifica con el error estándar adecuado, distingue colas unilaterales y bilaterales e interpreta cobertura y p-valor."
    },
    {
      "label": "Distribuciones muestrales y error estándar",
      "route": "/articles/sampling-distributions",
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
      "activity": "Una proporción muestral es una media de indicadores Bernoulli. Su aproximación normal conecta con la distribución de medias muestrales."
    },
    {
      "label": "Desigualdades de Markov y Chebyshev",
      "route": "/articles/probability-inequalities",
      "activity": "Obtén garantías de desviación desde media y varianza y compáralas con colas de distribuciones concretas."
    },
    {
      "label": "Intervalos para proporciones: Wilson y métodos exactos",
      "route": "/articles/proportion-intervals",
      "activity": "Amplía la inferencia binomial con Wilson y Clopper–Pearson, especialmente cerca de cero y uno."
    },
    {
      "label": "Potencia estadística y errores de contraste",
      "route": "/articles/statistical-power",
      "activity": "Planifica un efecto relevante y compara nivel, error de tipo II y potencia para distintos tamaños."
    },
    {
      "label": "Ensayos de Bernoulli y distribución binomial",
      "route": "/articles/bernoulli-binomial",
      "activity": "Comprueba independencia y probabilidad constante antes de contar éxitos."
    }
  ]
};
}
