import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tools-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tools-home.component.html',
  styleUrl: './tools-home.component.css',
})
export class ToolsHomeComponent {
  readonly groups = [
    {
      title: 'Representar y explorar',
      description: 'De una expresión a una imagen: descubre formas, relaciones y movimiento.',
      tools: [
        { route: 'graph-plotter', name: 'Graficador de funciones', symbol: 'ƒ(x)', description: 'Representa funciones y compara sus gráficas para explorar cómo cambian.' },
        { route: 'implicit-curve-graph', name: 'Curvas implícitas', symbol: 'F(x,y)', description: 'Explora curvas definidas por ecuaciones y descubre una galería de formas.' },
        { route: 'vector-field', name: 'Campos vectoriales y dinámica', symbol: '↗', description: 'Visualiza campos y trayectorias para investigar el comportamiento de sistemas dinámicos.' },
      ],
    },
    {
      title: 'Calcular y experimentar',
      description: 'Pon a prueba una idea, modifica los datos y observa el resultado.',
      tools: [
        { route: 'linear-algebra', name: 'Álgebra lineal', symbol: 'Ax=b', description: 'Resuelve sistemas, trabaja con fracciones exactas y visualiza transformaciones del plano.' },
        { route: 'probability-lab', name: 'Probabilidad y estadística', symbol: 'P(A)', description: 'Explora distribuciones, simula experimentos y contrasta tus predicciones con los datos.' },
        { route: 'prime-decomposition', name: 'Factorización en primos', symbol: 'pⁿ', description: 'Descompón números enteros en factores primos y examina su estructura.' },
        { route: 'pi-decimals', name: 'Decimales de π', symbol: 'π', description: 'Calcula cifras de la constante y explora su expansión decimal.' },
      ],
    },
    {
      title: 'Del modelo al mundo',
      description: 'Utiliza las matemáticas para orientarte en el espacio y en el tiempo.',
      tools: [
        { route: 'sun-position', name: 'Posición solar', symbol: '☀', description: 'Consulta la posición del Sol para una ubicación y un momento determinados.' },
        { route: 'travel-planner', name: 'Planificador de viajes', symbol: '◎', description: 'Explora destinos y organiza tu recorrido sobre el mapa.' },
      ],
    },
  ];
}
