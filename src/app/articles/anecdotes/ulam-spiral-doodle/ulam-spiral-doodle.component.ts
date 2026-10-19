import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-ulam-spiral-doodle', standalone: true, imports: [RouterLink], templateUrl: './ulam-spiral-doodle.component.html', styleUrls: ['../../shared/learning-article.css', './ulam-spiral-doodle.component.css'] })
export class UlamSpiralDoodleComponent {
  static readonly title = "Los números que Ulam dibujó en una reunión";
  static readonly route = 'ulam-spiral-doodle';
}
