import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-germain-leblanc', standalone: true, imports: [RouterLink], templateUrl: './germain-leblanc.component.html', styleUrls: ['../../shared/learning-article.css', './germain-leblanc.component.css'] })
export class GermainLeblancComponent {
  static readonly title = "Sophie Germain y la firma de Monsieur Le Blanc";
  static readonly route = 'germain-leblanc';
}
