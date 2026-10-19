import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-bayes-price-manuscript', standalone: true, imports: [RouterLink], templateUrl: './bayes-price-manuscript.component.html', styleUrls: ['../../shared/learning-article.css', './bayes-price-manuscript.component.css'] })
export class BayesPriceManuscriptComponent {
  static readonly title = "El manuscrito que Bayes no llegó a publicar";
  static readonly route = 'bayes-price-manuscript';
}
