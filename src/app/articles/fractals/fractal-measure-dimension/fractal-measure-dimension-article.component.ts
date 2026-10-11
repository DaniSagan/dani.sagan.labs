import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-fractal-measure-dimension-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './fractal-measure-dimension-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class FractalMeasureDimensionArticleComponent {
 static title = "Medida, dimensión y autosimilitud";
 static route = 'fractal-measure-dimension';
}
