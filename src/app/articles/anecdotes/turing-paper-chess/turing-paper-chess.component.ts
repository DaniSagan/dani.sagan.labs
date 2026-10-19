import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-turing-paper-chess', standalone: true, imports: [RouterLink], templateUrl: './turing-paper-chess.component.html', styleUrls: ['../../shared/learning-article.css', './turing-paper-chess.component.css'] })
export class TuringPaperChessComponent {
  static readonly title = "El ordenador de ajedrez que era un hombre";
  static readonly route = 'turing-paper-chess';
}
