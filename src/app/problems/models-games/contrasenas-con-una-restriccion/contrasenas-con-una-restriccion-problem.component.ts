import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-contrasenas-con-una-restriccion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './contrasenas-con-una-restriccion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ContrasenasConUnaRestriccionProblemComponent {
  static readonly title = "Contraseñas con una restricción";
  static readonly route = "restricted-password-count";
  static readonly problem: PracticeProblem = {
  "id": "problema-191",
  "route": "restricted-password-count",
  "number": 191,
  "title": "Contraseñas con una restricción",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Repaso",
  "statement": "Cuenta las claves de cuatro cifras que empiezan por una cifra no nula y no repiten ninguna cifra.",
  "resources": [
    {
      "label": "Principios de conteo: suma, producto y elecciones",
      "route": "/articles/counting-principles",
      "activity": "Practica contraseñas con una restricción. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Espacio muestral, sucesos y complemento",
      "route": "/articles/finite-probability",
      "activity": "Cuenta solo resultados equiprobables y distingue unión, intersección y complemento."
    }
  ]
};
}
