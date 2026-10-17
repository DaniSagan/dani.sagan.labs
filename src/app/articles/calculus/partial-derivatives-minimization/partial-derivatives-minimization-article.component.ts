import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-partial-derivatives-minimization-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './partial-derivatives-minimization-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class PartialDerivativesMinimizationArticleComponent {
 static readonly title = "Derivadas parciales y minimización en varias variables";
 static readonly route = 'partial-derivatives-minimization';

 intercept=0; slope=0;
 readonly observations=[{x:0,y:1},{x:1,y:2},{x:2,y:2}];
 get residuals(){return this.observations.map(p=>({...p,predicted:this.intercept+this.slope*p.x,error:p.y-this.intercept-this.slope*p.x}));}
 get loss(){return this.residuals.reduce((sum,p)=>sum+p.error*p.error,0);}
 get gradient(){return [-2*this.residuals.reduce((s,p)=>s+p.error,0),-2*this.residuals.reduce((s,p)=>s+p.x*p.error,0)];}
 get series(): PlotSeries[]{return [{label:'Recta candidata',points:[[-.3,this.intercept-.3*this.slope],[2.3,this.intercept+2.3*this.slope]]},...this.residuals.map((p,i)=>({label:'Residuo '+(i+1),dashed:true,points:[[p.x,p.y],[p.x,p.predicted]] as [number,number][]}))];}
 get markers(){return this.observations.map(p=>({...p,label:'Observación'}));}
 fit(){this.intercept=7/6;this.slope=.5;}
 reset(){this.intercept=0;this.slope=0;}

}
