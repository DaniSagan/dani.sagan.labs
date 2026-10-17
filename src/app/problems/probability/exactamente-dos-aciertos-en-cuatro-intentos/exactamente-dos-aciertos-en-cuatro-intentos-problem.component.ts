import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-exactamente-dos-aciertos-en-cuatro-intentos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './exactamente-dos-aciertos-en-cuatro-intentos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ExactamenteDosAciertosEnCuatroIntentosProblemComponent {
  static readonly title = "Exactamente dos aciertos en cuatro intentos";
  static readonly route = 'problema-174';
  static readonly problem: PracticeProblem = {
  "id": "problema-174",
  "number": 174,
  "title": "Exactamente dos aciertos en cuatro intentos",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Repaso",
  "statement": "Cada intento independiente tiene probabilidad 1/3 de éxito. ¿Cuál es la probabilidad de exactamente dos éxitos en cuatro intentos?",
  "resources": [
    {
      "label": "Distribuciones de Bernoulli y binomial",
      "route": "/articles/bernoulli-binomial",
      "activity": "Practica exactamente dos aciertos en cuatro intentos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Factoriales, exponentes primos y fórmula de Legendre",
      "route": "/articles/factorials-legendre",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
