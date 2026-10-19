import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-eratosthenes-shadows', standalone: true, imports: [RouterLink], templateUrl: './eratosthenes-shadows.component.html', styleUrls: ['../../shared/learning-article.css', './eratosthenes-shadows.component.css'] })
export class EratosthenesShadowsComponent {
  static readonly title = "Una sombra para medir la Tierra";
  static readonly route = 'eratosthenes-shadows';
}
