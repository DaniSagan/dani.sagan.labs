import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-ramanujan-first-letter', standalone: true, imports: [RouterLink], templateUrl: './ramanujan-first-letter.component.html', styleUrls: ['../../shared/learning-article.css', './ramanujan-first-letter.component.css'] })
export class RamanujanFirstLetterComponent {
  static readonly title = "La carta de Ramanujan que Hardy no pudo apartar";
  static readonly route = 'ramanujan-first-letter';
}
