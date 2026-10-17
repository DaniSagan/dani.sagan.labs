import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-proof-strategies-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './proof-strategies-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class ProofStrategiesArticleComponent {
 static readonly title = "Cómo demostrar: implicaciones, contradicción y contraposición";
 static readonly route = 'proof-strategies';

 hypothesis=true; conclusion=false;
 get implication(){return !this.hypothesis||this.conclusion;}
 get converse(){return !this.conclusion||this.hypothesis;}
 get contrapositive(){return this.conclusion||!this.hypothesis;}
 reset(){this.hypothesis=true;this.conclusion=false;}

}
