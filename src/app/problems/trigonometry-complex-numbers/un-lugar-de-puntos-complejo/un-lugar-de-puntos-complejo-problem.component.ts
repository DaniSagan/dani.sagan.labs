import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-lugar-de-puntos-complejo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-lugar-de-puntos-complejo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnLugarDePuntosComplejoProblemComponent {
  static readonly title = "Un lugar de puntos complejo";
  static readonly route = "complex-plane-locus";
  static readonly problem: PracticeProblem = {
  "id": "problema-037",
  "route": "complex-plane-locus",
  "number": 37,
  "title": "Un lugar de puntos complejo",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Oposición",
  "statement": "Describe geométricamente los z que cumplen \\(\\lvert z-1\\rvert =2\\lvert z+1\\rvert\\) y da centro y radio.",
  "resources": [
    {
      "label": "Geometría analítica de la recta y la circunferencia",
      "route": "/articles/line-circle",
      "activity": "Completa cuadrados, compara la distancia al centro con el radio y verifica las intersecciones en las ecuaciones originales."
    },
    {
      "label": "Circunferencias de Apolonio y razones de distancias",
      "route": "/articles/apollonius-circles",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Transformaciones de Möbius",
      "route": "/articles/mobius-transformations",
      "activity": "Transformaciones fraccionarias del plano complejo y sus imágenes geométricas."
    },
    {
      "label": "Valor absoluto: distancias y funciones a trozos",
      "route": "/articles/absolute-value-distance",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Aritmética compleja, módulo y conjugado",
      "route": "/articles/complex-arithmetic",
      "activity": "Calcula en forma binómica y usa el conjugado para dividir."
    },
    {
      "label": "Identidades notables y factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Desarrolla o agrupa términos para justificar la factorización utilizada."
    },
    {
      "label": "Cuadrados y soluciones extrañas",
      "route": "/articles/equation-equivalence",
      "fragment": "squaring",
      "activity": "Controla los signos antes de cuadrar para que la transformación sea reversible."
    },
    {
      "label": "Trazador de curvas implícitas",
      "route": "/tools/implicit-curve-graph",
      "activity": "Dibuja la ecuación cartesiana y comprueba centro, cortes o asíntotas."
    }
  ]
};
}
