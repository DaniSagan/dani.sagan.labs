import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-johnson-glenn-check', standalone: true, imports: [RouterLink], templateUrl: './johnson-glenn-check.component.html', styleUrls: ['../../shared/learning-article.css', './johnson-glenn-check.component.css'] })
export class JohnsonGlennCheckComponent {
  static readonly title = "Katherine Johnson: la comprobación que pidió John Glenn";
  static readonly route = 'johnson-glenn-check';
}
