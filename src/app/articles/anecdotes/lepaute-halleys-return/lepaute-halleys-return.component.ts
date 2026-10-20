import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-lepaute-halleys-return', standalone: true, imports: [RouterLink], templateUrl: './lepaute-halleys-return.component.html', styleUrls: ['../../shared/learning-article.css', './lepaute-halleys-return.component.css'] })
export class LepauteHalleysReturnComponent {
  static readonly title = "Lepaute: seis meses de cuentas para esperar a un cometa";
  static readonly route = 'lepaute-halleys-return';
}
