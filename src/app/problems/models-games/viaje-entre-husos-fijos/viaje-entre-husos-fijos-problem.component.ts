import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-viaje-entre-husos-fijos-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './viaje-entre-husos-fijos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ViajeEntreHusosFijosProblemComponent {
  static readonly title = "Viaje entre husos fijos";
  static readonly route = "problema-099";
  static readonly problem: PracticeProblem = {
    "id": "problema-099",
    "number": 99,
    "title": "Viaje entre husos fijos",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Dinámica y aplicaciones",
    "level": "Repaso",
    "statement": "Un vuelo sale a las 22:30 del 10 de enero desde una ciudad con \\(UTC+1\\) y llega a las 06:15 del 11 de enero a otra con \\(UTC+3\\). Suponiendo esos offsets constantes, calcula la duración.",
    "resources": [
      {
        "label": "Algoritmo de la división",
        "route": "/articles/division-algorithm",
        "activity": "Cociente y resto, útiles al convertir unidades y normalizar horas respecto al ciclo de 24 horas."
      },
      {
        "label": "Planificador de viajes",
        "route": "/tools/travel-planner",
        "activity": "Utiliza las diferencias horarias para verificar la conversión UTC del ejercicio «Viaje entre husos fijos»."
      }
    ]
  };
}
