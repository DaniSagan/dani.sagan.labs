import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-bayes-y-tasa-base-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './bayes-y-tasa-base-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class BayesYTasaBaseProblemComponent {
  static readonly title = "Bayes y tasa base";
  static readonly route = "bayes-and-base-rates";
  static readonly problem: PracticeProblem = {
  "id": "problema-073",
  "route": "bayes-and-base-rates",
  "number": 73,
  "title": "Bayes y tasa base",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Oposición",
  "statement": "Un detector marca el 90% de las piezas defectuosas y el 5% de las correctas. El 2% de las piezas son defectuosas. Si marca una pieza, ¿qué probabilidad hay de que sea defectuosa?",
  "resources": [
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Teorema de Bayes",
      "route": "/articles/bayes-theorem",
      "activity": "Probabilidades condicionadas, probabilidades totales e inversión de la condición."
    },
    {
      "label": "Causalidad, confusión y experimentos aleatorizados",
      "route": "/articles/causal-inference",
      "activity": "Separa asociación y efecto causal; estudia composición de grupos y supuestos de asignación."
    },
    {
      "label": "Espacio muestral, sucesos y complemento",
      "route": "/articles/finite-probability",
      "activity": "Cuenta solo resultados equiprobables y distingue unión, intersección y complemento."
    },
    {
      "label": "Árboles de probabilidad",
      "route": "/articles/probability-trees",
      "activity": "Multiplica a lo largo de cada camino y suma los caminos alternativos."
    },
    {
      "label": "Detective de probabilidad",
      "route": "/games/probability-detective",
      "activity": "Practica cómo una evidencia cambia las probabilidades sin olvidar la tasa base."
    }
  ]
};
}
