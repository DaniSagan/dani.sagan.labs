import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './zero-measure-dimension-lab.model';
@Component({
    selector: 'app-zero-measure-dimension-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './zero-measure-dimension-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class ZeroMeasureDimensionArticleComponent {
    readonly lab = lab;
    static readonly title = "Medida cero y dimensión fractal";
    static readonly route = 'zero-measure-dimension';
}
