import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-pasos-de-newton-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-pasos-de-newton-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosPasosDeNewtonProblemComponent {
  static readonly title = "Dos pasos de Newton";
  static readonly route = "problema-054";
  static readonly problem: PracticeProblem = {
    "id": "problema-054",
    "number": 54,
    "title": "Dos pasos de Newton",
    "category": "Cálculo diferencial y optimización",
    "topic": "Derivadas y teoremas",
    "level": "Oposición",
    "statement": "Aplica dos iteraciones de Newton a \\(x^{2}-2=0\\) desde \\(x_{0}=1\\), con aritmética exacta.",
    "resources": [
      {
        "label": "Newton–Raphson",
        "route": "/articles/newton-raphson",
        "activity": "Búsqueda de raíces mediante rectas tangentes e iteraciones sucesivas."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa x*exp(-x) para verificar la forma global descrita en el ejercicio «Estudio global de una función»."
      },
      {
        "label": "Campo vectorial",
        "route": "/tools/vector-field",
        "activity": "Explora el campo (−y,x) del ejercicio «Órbitas de un campo vectorial» y observa las trayectorias circulares."
      }
    ]
  };
}
