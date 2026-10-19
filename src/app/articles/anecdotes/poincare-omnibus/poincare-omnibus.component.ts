import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-poincare-omnibus', standalone: true, imports: [RouterLink], templateUrl: './poincare-omnibus.component.html', styleUrls: ['../../shared/learning-article.css', './poincare-omnibus.component.css'] })
export class PoincareOmnibusComponent {
  static readonly title = "La idea que subió al ómnibus con Poincaré";
  static readonly route = 'poincare-omnibus';
}
