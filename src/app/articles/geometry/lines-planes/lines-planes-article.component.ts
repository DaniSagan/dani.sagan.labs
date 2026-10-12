import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './lines-planes-lab.model';
@Component({
    selector: 'app-lines-planes-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './lines-planes-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class LinesPlanesArticleComponent {
    readonly lab = lab;
    static readonly title = "Rectas y planos en el espacio: posiciones relativas";
    static readonly route = 'lines-planes';
}
