import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-oscilador-celular-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-oscilador-celular-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnOsciladorCelularProblemComponent {
  static readonly title = "Un oscilador celular";
  static readonly route = "problema-096";
  static readonly problem: PracticeProblem = {
    "id": "problema-096",
    "number": 96,
    "title": "Un oscilador celular",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Dinámica y aplicaciones",
    "level": "Oposición",
    "statement": "En el Juego de la vida sobre una cuadrícula infinita, parte de las células vivas \\((-1,0),(0,0),(1,0)\\). Determina las dos generaciones siguientes con las reglas \\(B3/S23\\).",
    "resources": [
      {
        "label": "Autómatas celulares",
        "route": "/articles/cellular-automata",
        "activity": "Estados discretos, reglas locales y evolución simultánea de una configuración."
      },
      {
        "label": "Juego de la vida",
        "route": "/games/game-of-life",
        "activity": "Construye el oscilador de tres células del ejercicio «Un oscilador celular» y avanza dos generaciones."
      }
    ]
  };
}
