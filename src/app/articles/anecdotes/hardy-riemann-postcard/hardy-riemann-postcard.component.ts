import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-hardy-riemann-postcard', standalone: true, imports: [RouterLink], templateUrl: './hardy-riemann-postcard.component.html', styleUrls: ['../../shared/learning-article.css', './hardy-riemann-postcard.component.css'] })
export class HardyRiemannPostcardComponent {
  static readonly title = "Hardy: una postal como seguro de vida";
  static readonly route = 'hardy-riemann-postcard';
}
