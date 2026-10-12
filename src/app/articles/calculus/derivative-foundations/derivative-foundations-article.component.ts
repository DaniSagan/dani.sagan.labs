import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './derivative-foundations-lab.model';
@Component({
    selector: 'app-derivative-foundations-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './derivative-foundations-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class DerivativeFoundationsArticleComponent {
    readonly lab = lab;
    static readonly title = "Derivadas: definición, interpretación y reglas";
    static readonly route = 'derivative-foundations';
}
