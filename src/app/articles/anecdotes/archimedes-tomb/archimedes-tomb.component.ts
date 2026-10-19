import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-archimedes-tomb', standalone: true, imports: [RouterLink], templateUrl: './archimedes-tomb.component.html', styleUrls: ['../../shared/learning-article.css', './archimedes-tomb.component.css'] })
export class ArchimedesTombComponent {
  static readonly title = "La tumba que Cicerón reconoció por una esfera";
  static readonly route = 'archimedes-tomb';
}
