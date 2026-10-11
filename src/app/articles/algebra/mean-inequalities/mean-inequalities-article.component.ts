import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-mean-inequalities-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './mean-inequalities-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class MeanInequalitiesArticleComponent {
 static title = "Medias aritmética, geométrica y armónica";
 static route = 'mean-inequalities';
}
