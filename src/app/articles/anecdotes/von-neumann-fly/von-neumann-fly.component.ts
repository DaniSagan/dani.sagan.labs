import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-von-neumann-fly', standalone: true, imports: [RouterLink], templateUrl: './von-neumann-fly.component.html', styleUrls: ['../../shared/learning-article.css', './von-neumann-fly.component.css'] })
export class VonNeumannFlyComponent {
  static readonly title = "La mosca que von Neumann sumó demasiadas veces";
  static readonly route = 'von-neumann-fly';
}
