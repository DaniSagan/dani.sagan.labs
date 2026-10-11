import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-quadratic-conics-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './quadratic-conics-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class QuadraticConicsArticleComponent {
 static title = "Cónicas como formas cuadráticas";
 static route = 'quadratic-conics';
}
