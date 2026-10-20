import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector: 'app-nash-equilibrium-article', standalone: true, imports: [RouterLink], templateUrl: './nash-equilibrium-article.component.html', styleUrls: ['../../shared/learning-article.css']})
export class NashEquilibriumArticleComponent {
 static readonly title = "Equilibrio de Nash: mejores respuestas y estrategias mixtas";
 static readonly route = 'nash-equilibrium';
}
