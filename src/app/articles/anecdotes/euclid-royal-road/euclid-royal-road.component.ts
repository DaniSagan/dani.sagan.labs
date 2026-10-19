import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-euclid-royal-road', standalone: true, imports: [RouterLink], templateUrl: './euclid-royal-road.component.html', styleUrls: ['../../shared/learning-article.css', './euclid-royal-road.component.css'] })
export class EuclidRoyalRoadComponent {
  static readonly title = "El rey que buscaba un atajo a la geometría";
  static readonly route = 'euclid-royal-road';
}
