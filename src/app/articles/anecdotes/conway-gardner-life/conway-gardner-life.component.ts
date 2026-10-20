import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-conway-gardner-life', standalone: true, imports: [RouterLink], templateUrl: './conway-gardner-life.component.html', styleUrls: ['../../shared/learning-article.css', './conway-gardner-life.component.css'] })
export class ConwayGardnerLifeComponent {
  static readonly title = "Conway: el pequeño mundo que Gardner puso en circulación";
  static readonly route = 'conway-gardner-life';
}
