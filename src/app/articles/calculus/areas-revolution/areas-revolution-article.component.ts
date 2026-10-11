import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-areas-revolution-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './areas-revolution-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class AreasRevolutionArticleComponent {
 static title = "Áreas entre curvas y sólidos de revolución";
 static route = 'areas-revolution';
}
