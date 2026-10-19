import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-newton-lion-claw', standalone: true, imports: [RouterLink], templateUrl: './newton-lion-claw.component.html', styleUrls: ['../../shared/learning-article.css', './newton-lion-claw.component.css'] })
export class NewtonLionClawComponent {
  static readonly title = "Una solución con garras de león";
  static readonly route = 'newton-lion-claw';
}
