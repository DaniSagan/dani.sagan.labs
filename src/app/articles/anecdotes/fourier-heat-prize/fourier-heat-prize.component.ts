import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-fourier-heat-prize', standalone: true, imports: [RouterLink], templateUrl: './fourier-heat-prize.component.html', styleUrls: ['../../shared/learning-article.css', './fourier-heat-prize.component.css'] })
export class FourierHeatPrizeComponent {
  static readonly title = "Fourier ganó el premio; su memoria tuvo que esperar";
  static readonly route = 'fourier-heat-prize';
}
