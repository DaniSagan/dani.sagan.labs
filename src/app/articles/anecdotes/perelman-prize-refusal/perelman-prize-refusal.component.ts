import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-perelman-prize-refusal', standalone: true, imports: [RouterLink], templateUrl: './perelman-prize-refusal.component.html', styleUrls: ['../../shared/learning-article.css', './perelman-prize-refusal.component.css'] })
export class PerelmanPrizeRefusalComponent {
  static readonly title = "Perelmán y el premio que no quiso cobrar";
  static readonly route = 'perelman-prize-refusal';
}
