import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-godel-citizenship', standalone: true, imports: [RouterLink], templateUrl: './godel-citizenship.component.html', styleUrls: ['../../shared/learning-article.css', './godel-citizenship.component.css'] })
export class GodelCitizenshipComponent {
  static readonly title = "El día que Gödel encontró un problema en la Constitución";
  static readonly route = 'godel-citizenship';
}
