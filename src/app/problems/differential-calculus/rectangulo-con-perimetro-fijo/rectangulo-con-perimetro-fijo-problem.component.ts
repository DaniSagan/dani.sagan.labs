import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-rectangulo-con-perimetro-fijo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './rectangulo-con-perimetro-fijo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RectanguloConPerimetroFijoProblemComponent {
  static readonly title = "Rectángulo con perímetro fijo";
  static readonly route = "maximum-area-with-fixed-perimeter";
  static readonly problem: PracticeProblem = {
  "id": "problema-056",
  "route": "maximum-area-with-fixed-perimeter",
  "number": 56,
  "title": "Rectángulo con perímetro fijo",
  "category": "Cálculo diferencial y optimización",
  "topic": "Optimización y modelos",
  "level": "Repaso",
  "statement": "Entre los rectángulos de perímetro 40 cm, determina el de área máxima.",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Medias aritmética, geométrica y armónica",
      "route": "/articles/mean-inequalities",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Optimización con derivadas",
      "route": "/articles/derivative-optimization",
      "activity": "Construye la función objetivo, determina el dominio y compara candidatos interiores y extremos para justificar el óptimo global."
    },
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "La integración clásica amplía el cálculo de áreas a regiones curvas. En este ejercicio el área rectangular se obtiene directamente como producto de lados."
    },
    {
      "label": "Extremos globales y teorema de Weierstrass",
      "route": "/articles/global-extrema-weierstrass",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
