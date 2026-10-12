import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './exponentials-logarithms-lab.model';
@Component({
    selector: 'app-exponentials-logarithms-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './exponentials-logarithms-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class ExponentialsLogarithmsArticleComponent {
    readonly lab = lab;
    static readonly title = "Exponenciales y logaritmos: propiedades y ecuaciones";
    static readonly route = 'exponentials-logarithms';
}
