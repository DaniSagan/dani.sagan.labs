import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-raices-y-parametro-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './raices-y-parametro-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RaicesYParametroProblemComponent {
  static readonly title = "Raíces y parámetro";
  static readonly route = "quadratic-roots-and-parameter";
  static readonly problem: PracticeProblem = {
  "id": "problema-012",
  "route": "quadratic-roots-and-parameter",
  "number": 12,
  "title": "Raíces y parámetro",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Oposición",
  "statement": "Determina los valores reales de a para los que \\(x^{2}-2ax+a+2\\) tiene dos raíces reales distintas y positivas.",
  "resources": [
    {
      "label": "Ecuaciones cuadráticas: discriminante y Viète",
      "route": "/articles/quadratic-equations",
      "activity": "Clasifica las raíces reales y sus signos combinando el discriminante con la suma y el producto de Viète."
    },
    {
      "label": "La ecuación cúbica",
      "route": "/articles/cubic-equation",
      "activity": "Compara el papel de las raíces y los parámetros en una ecuación cúbica con la clasificación cuadrática de este ejercicio; las fórmulas de los discriminantes son distintas."
    },
    {
      "label": "Inecuaciones y tablas de signos",
      "route": "/articles/sign-charts",
      "activity": "Organiza ceros y puntos excluidos por intervalos y combina correctamente las condiciones de signo."
    }
  ]
};
}
