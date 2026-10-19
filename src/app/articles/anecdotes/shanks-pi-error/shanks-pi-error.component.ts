import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-shanks-pi-error', standalone: true, imports: [RouterLink], templateUrl: './shanks-pi-error.component.html', styleUrls: ['../../shared/learning-article.css', './shanks-pi-error.component.css'] })
export class ShanksPiErrorComponent {
  static readonly title = "Shanks y el decimal que torció una vida de cuentas";
  static readonly route = 'shanks-pi-error';
}
