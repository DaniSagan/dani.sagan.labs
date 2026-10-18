import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-falso-positivo-en-una-poblacion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-falso-positivo-en-una-poblacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnFalsoPositivoEnUnaPoblacionProblemComponent {
  static readonly title = "Un falso positivo en una población";
  static readonly route = "false-positive-in-a-population";
  static readonly problem: PracticeProblem = {
  "id": "problema-172",
  "route": "false-positive-in-a-population",
  "number": 172,
  "title": "Un falso positivo en una población",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Repaso",
  "statement": "Una condición aparece en el 2% de una población. Una prueba detecta el 90% de los casos y da positivo en el 5% de quienes no la tienen. Calcula la probabilidad de tener la condición dado un positivo.",
  "resources": [
    {
      "label": "Teorema de Bayes",
      "route": "/articles/bayes-theorem",
      "activity": "Practica un falso positivo en una población. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Distingue restringir el espacio de resultados, multiplicar probabilidades y sumar casos disjuntos."
    },
    {
      "label": "Espacio muestral, sucesos y complemento",
      "route": "/articles/finite-probability",
      "activity": "Cuenta solo resultados equiprobables y distingue unión, intersección y complemento."
    },
    {
      "label": "Detective de probabilidad",
      "route": "/games/probability-detective",
      "activity": "Practica cómo una evidencia cambia las probabilidades sin olvidar la tasa base."
    }
  ]
};
}
