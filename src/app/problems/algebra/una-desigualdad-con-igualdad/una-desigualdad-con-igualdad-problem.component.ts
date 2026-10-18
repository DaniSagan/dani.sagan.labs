import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-desigualdad-con-igualdad-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-desigualdad-con-igualdad-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDesigualdadConIgualdadProblemComponent {
  static readonly title = "Una desigualdad con igualdad";
  static readonly route = "inequality-and-equality-case";
  static readonly problem: PracticeProblem = {
  "id": "problema-014",
  "route": "inequality-and-equality-case",
  "number": 14,
  "title": "Una desigualdad con igualdad",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Oposición",
  "statement": "Demuestra que \\((a+b+c)(1/a+1/b+1/c)\\ge 9\\) para \\(a,b,c>0\\) e identifica cuándo hay igualdad.",
  "resources": [
    {
      "label": "Medias aritmética, geométrica y armónica",
      "route": "/articles/mean-inequalities",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Desigualdad de Cauchy–Schwarz",
      "route": "/articles/cauchy-schwarz",
      "activity": "Demuestra la desigualdad de recíprocos con Cauchy–Schwarz y comprueba cuándo se alcanza la igualdad."
    },
    {
      "label": "Determinantes",
      "route": "/articles/matrix-determinant",
      "activity": "Conexión con determinantes: los dos vectores de Cauchy tienen matriz de Gram ((a+b+c,3),(3,1/a+1/b+1/c)); su determinante no negativo equivale a la desigualdad."
    },
    {
      "label": "Cuadrados y soluciones extrañas",
      "route": "/articles/equation-equivalence",
      "fragment": "squaring",
      "activity": "Controla los signos antes de cuadrar para que la transformación sea reversible."
    }
  ]
};
}
