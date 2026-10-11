import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-grid-counting-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './grid-counting-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class GridCountingArticleComponent {
 static title = "Conteo sistemático en tableros y cuadrículas";
 static route = 'grid-counting';
}
