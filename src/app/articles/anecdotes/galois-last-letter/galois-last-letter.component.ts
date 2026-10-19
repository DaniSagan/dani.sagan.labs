import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-galois-last-letter', standalone: true, imports: [RouterLink], templateUrl: './galois-last-letter.component.html', styleUrls: ['../../shared/learning-article.css', './galois-last-letter.component.css'] })
export class GaloisLastLetterComponent {
  static readonly title = "La última carta de Galois";
  static readonly route = 'galois-last-letter';
}
