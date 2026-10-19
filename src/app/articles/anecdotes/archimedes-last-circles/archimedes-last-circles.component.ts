import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-archimedes-last-circles', standalone: true, imports: [RouterLink], templateUrl: './archimedes-last-circles.component.html', styleUrls: ['../../shared/learning-article.css', './archimedes-last-circles.component.css'] })
export class ArchimedesLastCirclesComponent {
  static readonly title = "Los últimos círculos de Arquímedes";
  static readonly route = 'archimedes-last-circles';
}
