import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-weil-rouen-prison', standalone: true, imports: [RouterLink], templateUrl: './weil-rouen-prison.component.html', styleUrls: ['../../shared/learning-article.css', './weil-rouen-prison.component.css'] })
export class WeilRouenPrisonComponent {
  static readonly title = "André Weil: una carta matemática desde la prisión";
  static readonly route = 'weil-rouen-prison';
}
