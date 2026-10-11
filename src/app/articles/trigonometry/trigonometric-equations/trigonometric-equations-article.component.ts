import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-trigonometric-equations-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './trigonometric-equations-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class TrigonometricEquationsArticleComponent {
 static title = "Ecuaciones trigonométricas y periodicidad";
 static route = 'trigonometric-equations';
}
