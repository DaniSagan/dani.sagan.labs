import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-wolfskehl-fermat-prize', standalone: true, imports: [RouterLink], templateUrl: './wolfskehl-fermat-prize.component.html', styleUrls: ['../../shared/learning-article.css', './wolfskehl-fermat-prize.component.css'] })
export class WolfskehlFermatPrizeComponent {
  static readonly title = "Wolfskehl: una herencia que esperó a Andrew Wiles";
  static readonly route = 'wolfskehl-fermat-prize';
}
