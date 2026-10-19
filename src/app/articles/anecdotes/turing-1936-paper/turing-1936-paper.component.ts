import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-turing-1936-paper', standalone: true, imports: [RouterLink], templateUrl: './turing-1936-paper.component.html', styleUrls: ['../../shared/learning-article.css', './turing-1936-paper.component.css'] })
export class Turing1936PaperComponent {
  static readonly title = "El artículo de Turing que llegó con un rival";
  static readonly route = 'turing-1936-paper';
}
