import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-banach-tarski-sphere', standalone: true, imports: [RouterLink], templateUrl: './banach-tarski-sphere.component.html', styleUrls: ['../../shared/learning-article.css', './banach-tarski-sphere.component.css'] })
export class BanachTarskiSphereComponent {
  static readonly title = "Dos esferas por el precio de una, solo en matemáticas";
  static readonly route = 'banach-tarski-sphere';
}
