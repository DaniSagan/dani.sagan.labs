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
  static readonly route = "problema-056";
  static readonly problem: PracticeProblem = {
    "id": "problema-056",
    "number": 56,
    "title": "Rectángulo con perímetro fijo",
    "category": "Cálculo diferencial y optimización",
    "topic": "Optimización y modelos",
    "level": "Repaso",
    "statement": "Entre los rectángulos de perímetro 40 cm, determina el de área máxima.",
    "resources": [
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
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa x*exp(-x) para verificar la forma global descrita en el ejercicio «Estudio global de una función»."
      },
      {
        "label": "Campo vectorial",
        "route": "/tools/vector-field",
        "activity": "Explora el campo (−y,x) del ejercicio «Órbitas de un campo vectorial» y observa las trayectorias circulares."
      }
    ]
  };
}
