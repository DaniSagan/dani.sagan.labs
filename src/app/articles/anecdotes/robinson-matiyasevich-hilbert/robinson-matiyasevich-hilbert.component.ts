import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-robinson-matiyasevich-hilbert', standalone: true, imports: [RouterLink], templateUrl: './robinson-matiyasevich-hilbert.component.html', styleUrls: ['../../shared/learning-article.css', './robinson-matiyasevich-hilbert.component.css'] })
export class RobinsonMatiyasevichHilbertComponent {
  static readonly title = "Julia Robinson y la última pieza de un problema de Hilbert";
  static readonly route = 'robinson-matiyasevich-hilbert';
}
