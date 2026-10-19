import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-mirzakhani-paper', standalone: true, imports: [RouterLink], templateUrl: './mirzakhani-paper.component.html', styleUrls: ['../../shared/learning-article.css', './mirzakhani-paper.component.css'] })
export class MirzakhaniPaperComponent {
  static readonly title = "El suelo de papel de Maryam Mirzakhani";
  static readonly route = 'mirzakhani-paper';
}
