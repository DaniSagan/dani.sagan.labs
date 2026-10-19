import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-cantor-infinity-dispute', standalone: true, imports: [RouterLink], templateUrl: './cantor-infinity-dispute.component.html', styleUrls: ['../../shared/learning-article.css', './cantor-infinity-dispute.component.css'] })
export class CantorInfinityDisputeComponent {
  static readonly title = "Cantor y el infinito que no convencía a su maestro";
  static readonly route = 'cantor-infinity-dispute';
}
