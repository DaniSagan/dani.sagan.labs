import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-nacimiento-y-una-supervivencia-en-vida-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-nacimiento-y-una-supervivencia-en-vida-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnNacimientoYUnaSupervivenciaEnVidaProblemComponent {
  static readonly title = "Un nacimiento y una supervivencia en Vida";
  static readonly route = 'problema-198';
  static readonly problem: PracticeProblem = {
  "id": "problema-198",
  "number": 198,
  "title": "Un nacimiento y una supervivencia en Vida",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Dinámica y aplicaciones",
  "level": "Repaso",
  "statement": "En el Juego de la Vida, solo están vivas las celdas (−1,0), (0,0), (1,0) de una cuadrícula infinita. Calcula la generación siguiente con la regla B3/S23.",
  "resources": [
    {
      "label": "El Juego de la vida: osciladores y evolución",
      "route": "/articles/life-patterns",
      "activity": "Practica un nacimiento y una supervivencia en Vida. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
