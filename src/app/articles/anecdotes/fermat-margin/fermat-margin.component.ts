import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-fermat-margin', standalone: true, imports: [RouterLink], templateUrl: './fermat-margin.component.html', styleUrls: ['../../shared/learning-article.css', './fermat-margin.component.css'] })
export class FermatMarginComponent {
  static readonly title = "El margen más caro de las matemáticas";
  static readonly route = 'fermat-margin';
}
