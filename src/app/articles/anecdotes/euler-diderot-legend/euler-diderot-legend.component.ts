import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-euler-diderot-legend', standalone: true, imports: [RouterLink], templateUrl: './euler-diderot-legend.component.html', styleUrls: ['../../shared/learning-article.css', './euler-diderot-legend.component.css'] })
export class EulerDiderotLegendComponent {
  static readonly title = "La demostración de Dios que no demuestra nada";
  static readonly route = 'euler-diderot-legend';
}
