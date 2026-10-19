import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-erdos-book', standalone: true, imports: [RouterLink], templateUrl: './erdos-book.component.html', styleUrls: ['../../shared/learning-article.css', './erdos-book.component.css'] })
export class ErdosBookComponent {
  static readonly title = "Erdős y el libro que no estaba en ninguna biblioteca";
  static readonly route = 'erdos-book';
}
