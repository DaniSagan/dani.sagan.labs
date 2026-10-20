import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-euler-seven-bridges-walk', standalone: true, imports: [RouterLink], templateUrl: './euler-seven-bridges-walk.component.html', styleUrls: ['../../shared/learning-article.css', './euler-seven-bridges-walk.component.css'] })
export class EulerSevenBridgesWalkComponent {
  static readonly title = "Los siete puentes: un paseo condenado al fracaso";
  static readonly route = 'euler-seven-bridges-walk';
}
