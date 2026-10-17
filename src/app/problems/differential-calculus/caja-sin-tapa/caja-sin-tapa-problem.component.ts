import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-caja-sin-tapa-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './caja-sin-tapa-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CajaSinTapaProblemComponent {
  static readonly title = "Caja sin tapa";
  static readonly route = "problema-057";
  static readonly problem: PracticeProblem = {
  "id": "problema-057",
  "number": 57,
  "title": "Caja sin tapa",
  "category": "Cálculo diferencial y optimización",
  "topic": "Optimización y modelos",
  "level": "Oposición",
  "statement": "De una cartulina cuadrada de 12 cm de lado se recortan cuadrados iguales de lado x en las esquinas y se pliegan las paredes. Maximiza el volumen de la caja sin tapa.",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Optimización con derivadas",
      "route": "/articles/derivative-optimization",
      "activity": "Construye la función objetivo, determina el dominio y compara candidatos interiores y extremos para justificar el óptimo global."
    },
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Como ampliación, compara el volumen obtenido por dimensiones de una caja con los métodos de volumen por secciones en integración clásica."
    },
    {
      "label": "Representador de funciones",
      "route": "/tools/graph-plotter",
      "activity": "Representa x*exp(-x) para verificar la forma global descrita en el ejercicio «Estudio global de una función»."
    },
    {
      "label": "Campo vectorial",
      "route": "/tools/vector-field",
      "activity": "Explora el campo (−y,x) del ejercicio «Órbitas de un campo vectorial» y observa las trayectorias circulares."
    },
    {
      "label": "Extremos globales y teorema de Weierstrass",
      "route": "/articles/global-extrema-weierstrass",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
