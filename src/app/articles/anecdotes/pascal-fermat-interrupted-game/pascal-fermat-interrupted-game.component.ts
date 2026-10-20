import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-pascal-fermat-interrupted-game', standalone: true, imports: [RouterLink], templateUrl: './pascal-fermat-interrupted-game.component.html', styleUrls: ['../../shared/learning-article.css', './pascal-fermat-interrupted-game.component.css'] })
export class PascalFermatInterruptedGameComponent {
  static readonly title = "Pascal y Fermat: repartir una apuesta que nadie había ganado";
  static readonly route = 'pascal-fermat-interrupted-game';
}
