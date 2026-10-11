import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-arc-length-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './arc-length-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class ArcLengthArticleComponent {
 static title = "Longitud de arco y parametrización de curvas";
 static route = 'arc-length';
}
