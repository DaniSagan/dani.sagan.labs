import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-tartaglia-cardano-secret', standalone: true, imports: [RouterLink], templateUrl: './tartaglia-cardano-secret.component.html', styleUrls: ['../../shared/learning-article.css', './tartaglia-cardano-secret.component.css'] })
export class TartagliaCardanoSecretComponent {
  static readonly title = "Tartaglia y Cardano: una fórmula, un juramento y una disputa";
  static readonly route = 'tartaglia-cardano-secret';
}
