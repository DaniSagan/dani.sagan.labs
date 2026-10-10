import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-resumenes-iguales-graficos-distintos-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './resumenes-iguales-graficos-distintos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ResumenesIgualesGraficosDistintosProblemComponent {
  static readonly title = "Resúmenes iguales, gráficos distintos";
  static readonly route = "problema-085";
  static readonly problem: PracticeProblem = {
    "id": "problema-085",
    "number": 85,
    "title": "Resúmenes iguales, gráficos distintos",
    "category": "Estadística y lectura crítica de datos",
    "topic": "Descriptiva y regresión",
    "level": "Oposición",
    "statement": "Dos conjuntos tienen la misma media y varianza de x e y y la misma correlación. ¿Implica que sus diagramas de dispersión son iguales o que el mismo modelo lineal es adecuado? Explica cómo lo comprobarías con Datasaurus.",
    "resources": [
      {
        "label": "Tablero de Galton",
        "route": "/articles/galton-board",
        "activity": "La representación de la distribución en el tablero de Galton sirve como contraste entre forma gráfica y medidas resumen; no sustituye la inspección de los datos de Datasaurus."
      },
      {
        "label": "Laboratorio de probabilidad y datos",
        "route": "/tools/probability-lab",
        "activity": "Carga Datasaurus y compara resúmenes y gráficos para el ejercicio «Resúmenes iguales, gráficos distintos»; explora también muestreo e histogramas."
      }
    ]
  };
}
