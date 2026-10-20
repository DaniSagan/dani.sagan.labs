import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-hurwitz-mersenne-computer', standalone: true, imports: [RouterLink], templateUrl: './hurwitz-mersenne-computer.component.html', styleUrls: ['../../shared/learning-article.css', './hurwitz-mersenne-computer.component.css'] })
export class HurwitzMersenneComputerComponent {
  static readonly title = "Hurwitz: cincuenta minutos para un primo de 1332 cifras";
  static readonly route = 'hurwitz-mersenne-computer';
}
