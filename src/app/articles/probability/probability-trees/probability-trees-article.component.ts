import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-probability-trees-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './probability-trees-article.component.html',
 styleUrls: ['../../shared/learning-article.css', './probability-trees-article.component.css'],
})
export class ProbabilityTreesArticleComponent {
 static readonly title = "Árboles de probabilidad y experimentos por etapas";
 static readonly route = 'probability-trees';

 red=3; replacement=true;
 get first(){return this.red/5;}
 get afterRed(){return this.replacement?this.first:(this.red-1)/4;}
 get afterBlue(){return this.replacement?this.first:this.red/4;}
 get leaves(){return [{name:'RR',value:this.first*this.afterRed},{name:'RA',value:this.first*(1-this.afterRed)},{name:'AR',value:(1-this.first)*this.afterBlue},{name:'AA',value:(1-this.first)*(1-this.afterBlue)}];}
 get different(){return this.leaves[1].value+this.leaves[2].value;}
 get total(){return this.leaves.reduce((s,p)=>s+p.value,0);}
 reset(){this.red=3;this.replacement=true;}

}
