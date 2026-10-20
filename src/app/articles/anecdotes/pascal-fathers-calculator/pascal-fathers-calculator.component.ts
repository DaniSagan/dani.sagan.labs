import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-pascal-fathers-calculator', standalone: true, imports: [RouterLink], templateUrl: './pascal-fathers-calculator.component.html', styleUrls: ['../../shared/learning-article.css', './pascal-fathers-calculator.component.css'] })
export class PascalFathersCalculatorComponent {
  static readonly title = "Pascal: una máquina para las cuentas de su padre";
  static readonly route = 'pascal-fathers-calculator';
}
