import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-gauss-school-sum', standalone: true, imports: [RouterLink], templateUrl: './gauss-school-sum.component.html', styleUrls: ['../../shared/learning-article.css', './gauss-school-sum.component.css'] })
export class GaussSchoolSumComponent {
  static readonly title = 'Gauss y la suma del 1 al 100';
  static readonly route = 'gauss-school-sum';
}
