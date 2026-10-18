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
  static readonly route = "travel-between-fixed-time-zones";
  static readonly problem: PracticeProblem = {
  "id": "problema-099",
  "route": "travel-between-fixed-time-zones",
  "number": 99,
  "title": "Viaje entre husos fijos",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Dinámica y aplicaciones",
  "level": "Repaso",
  "statement": "Un vuelo sale a las 22:30 del 10 de enero desde una ciudad con \\(UTC+1\\) y llega a las 06:15 del 11 de enero a otra con \\(UTC+3\\). Suponiendo esos offsets constantes, calcula la duración.",
  "resources": [
    {
      "label": "UTC, husos horarios y aritmética de fechas",
      "route": "/articles/utc-date-arithmetic",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Algoritmo de la división",
      "route": "/articles/division-algorithm",
      "activity": "Cociente y resto, útiles al convertir unidades y normalizar horas respecto al ciclo de 24 horas."
    },
    {
      "label": "Planificador de viajes",
      "route": "/tools/travel-planner",
      "activity": "Utiliza las diferencias horarias para verificar la conversión UTC del ejercicio «Viaje entre husos fijos»."
    },
    {
      "label": "Ecuación del tiempo y mediodía solar",
      "route": "/articles/equation-of-time",
      "activity": "Separa tiempo solar aparente, tiempo medio, longitud geográfica y desfase civil."
    },
    {
      "label": "Horario estacional y horas locales ambiguas",
      "route": "/articles/daylight-saving-time",
      "activity": "Detecta horas repetidas o inexistentes y calcula duraciones usando instantes UTC inequívocos."
    }
  ]
};
}
