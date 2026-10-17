import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-caminos-minimos-en-una-cuadricula-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './caminos-minimos-en-una-cuadricula-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CaminosMinimosEnUnaCuadriculaProblemComponent {
  static readonly title = "Caminos mínimos en una cuadrícula";
  static readonly route = 'problema-192';
  static readonly problem: PracticeProblem = {
  "id": "problema-192",
  "number": 192,
  "title": "Caminos mínimos en una cuadrícula",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Repaso",
  "statement": "Cuenta los caminos desde (0,0) hasta (4,3) que solo avanzan una unidad a la derecha o una hacia arriba.",
  "resources": [
    {
      "label": "Conteo sistemático en tableros y cuadrículas",
      "route": "/articles/grid-counting",
      "activity": "Practica caminos mínimos en una cuadrícula. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
