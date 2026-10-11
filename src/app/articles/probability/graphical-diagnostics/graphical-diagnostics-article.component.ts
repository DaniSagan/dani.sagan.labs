import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-graphical-diagnostics-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './graphical-diagnostics-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class GraphicalDiagnosticsArticleComponent {
 static title = "Diagnóstico gráfico: Anscombe, Datasaurus y residuos";
 static route = 'graphical-diagnostics';
}
