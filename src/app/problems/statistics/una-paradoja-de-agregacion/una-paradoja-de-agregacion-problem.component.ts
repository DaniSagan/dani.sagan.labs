import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-paradoja-de-agregacion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-paradoja-de-agregacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaParadojaDeAgregacionProblemComponent {
  static readonly title = "Una paradoja de agregación";
  static readonly route = "simpsons-aggregation-paradox";
  static readonly problem: PracticeProblem = {
  "id": "problema-084",
  "route": "simpsons-aggregation-paradox",
  "number": 84,
  "title": "Una paradoja de agregación",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Oposición",
  "statement": "El tratamiento A cura 9 de 10 casos leves y 30 de 100 graves. B cura 80 de 100 leves y 2 de 10 graves. Compara las tasas por gravedad y globales.",
  "resources": [
    {
      "label": "Paradoja de Simpson",
      "route": "/articles/simpson-paradox",
      "activity": "Explica la inversión de tasas al agregar grupos y compara las alternativas con pesos de población comunes."
    },
    {
      "label": "Teorema de Bayes",
      "route": "/articles/bayes-theorem",
      "activity": "Condicionar por gravedad modifica las proporciones de los grupos; el teorema de probabilidad total ayuda a entender las ponderaciones de las tasas agregadas."
    },
    {
      "label": "Causalidad, confusión y experimentos aleatorizados",
      "route": "/articles/causal-inference",
      "activity": "Separa asociación y efecto causal; estudia composición de grupos y supuestos de asignación."
    },
    {
      "label": "Muestreo estratificado y estimadores ponderados",
      "route": "/articles/stratified-sampling",
      "activity": "Recombina las medias de grupos con pesos poblacionales y distingue composición de muestra y población."
    },
    {
      "label": "Media, mediana, varianza y desviación típica",
      "route": "/articles/descriptive-statistics",
      "activity": "Distingue posición de dispersión y especifica el divisor de la varianza."
    },
    {
      "label": "Sesgo de selección y representatividad",
      "route": "/articles/sampling-bias",
      "activity": "Un tamaño grande no corrige una selección que excluye parte de la población."
    }
  ]
};
}
