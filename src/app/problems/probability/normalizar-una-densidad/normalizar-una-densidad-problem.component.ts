import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-normalizar-una-densidad-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './normalizar-una-densidad-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class NormalizarUnaDensidadProblemComponent {
  static readonly title = "Normalizar una densidad";
  static readonly route = "problema-078";
  static readonly problem: PracticeProblem = {
    "id": "problema-078",
    "number": 78,
    "title": "Normalizar una densidad",
    "category": "Probabilidad",
    "topic": "Variables aleatorias",
    "level": "Oposición",
    "statement": "Sea \\(f(x)=cx\\) para \\(0\\le x\\le 2\\) y \\(f(x)=0\\) fuera. Halla c, \\(P(X\\le 1)\\), \\(E(X)\\) y \\(\\operatorname{Var}(X)\\).",
    "resources": [
      {
        "label": "Integración clásica",
        "route": "/articles/integration-classical",
        "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
      },
      {
        "label": "Laboratorio de probabilidad",
        "route": "/tools/probability-lab",
        "activity": "Simula experimentos de los ejercicios «Dos dados y una condición», «Extracción sin reemplazo», «Una distribución binomial» y compara frecuencias con probabilidades exactas."
      }
    ]
  };
}
