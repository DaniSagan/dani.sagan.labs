import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-cambiar-las-unidades-de-unos-datos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './cambiar-las-unidades-de-unos-datos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CambiarLasUnidadesDeUnosDatosProblemComponent {
  static readonly title = "Cambiar las unidades de unos datos";
  static readonly route = "changing-data-units";
  static readonly problem: PracticeProblem = {
  "id": "problema-184",
  "route": "changing-data-units",
  "number": 184,
  "title": "Cambiar las unidades de unos datos",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Descriptiva y regresión",
  "level": "Repaso",
  "statement": "Unos datos en Celsius tienen media 20 y desviación típica 3. Al convertirlos con F=1,8C+32, calcula media, varianza y desviación en Fahrenheit.",
  "resources": [
    {
      "label": "Transformaciones de variables y de sus momentos",
      "route": "/articles/moment-transformations",
      "activity": "Practica cambiar las unidades de unos datos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Media, mediana, varianza y desviación típica",
      "route": "/articles/descriptive-statistics",
      "activity": "Distingue posición de dispersión y especifica el divisor de la varianza."
    },
    {
      "label": "Análisis dimensional",
      "route": "/articles/dimensional-analysis",
      "activity": "Iguala los exponentes de las dimensiones y distingue escala de constante física."
    }
  ]
};
}
