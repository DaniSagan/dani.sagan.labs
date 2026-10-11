import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-function-analysis-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './function-analysis-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class FunctionAnalysisArticleComponent {
 static title = "Estudio completo de funciones";
 static route = 'function-analysis';
}
