import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-hippasus-irrational-legend', standalone: true, imports: [RouterLink], templateUrl: './hippasus-irrational-legend.component.html', styleUrls: ['../../shared/learning-article.css', './hippasus-irrational-legend.component.css'] })
export class HippasusIrrationalLegendComponent {
  static readonly title = "El número que no cabía en una fracción";
  static readonly route = 'hippasus-irrational-legend';
}
