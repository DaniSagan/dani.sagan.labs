import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-distribution-functions-tails-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './distribution-functions-tails-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class DistributionFunctionsTailsArticleComponent {
 static readonly title = "Función de distribución, colas y probabilidades acumuladas";
 static readonly route = 'distribution-functions-tails';

 family='geometric'; probability=.5; x=2;
 cdf(t:number){return this.family==='triangular'?t<=0?0:t>=1?1:t*t:t<1?0:1-(1-this.probability)**Math.floor(t);}
 get accumulated(){return this.cdf(this.x);}
 get tail(){return 1-this.accumulated;}
 get pointMass(){return this.family==='geometric'&&Number.isInteger(this.x)&&this.x>=1?this.probability*(1-this.probability)**(this.x-1):0;}
 get series(): PlotSeries[]{if(this.family==='triangular')return [{label:'F(x)',points:Array.from({length:121},(_,i)=>{const t=-1+i*.05;return [t,this.cdf(t)] as [number,number];})}];const points:[number,number][]=[[-1,0],[1,0]];for(let k=1;k<=6;k++){points.push([k,this.cdf(k)],[k+1,this.cdf(k)]);}return [{label:'F(x): las líneas verticales indican saltos',points}];}
 get markers(){const markers=[{x:this.x,y:this.accumulated,label:'Probabilidad acumulada',open:false}];if(this.family==='geometric')for(let k=1;k<=5;k++){markers.push({x:k,y:this.cdf(k-1),label:'Límite izquierdo excluido',open:true},{x:k,y:this.cdf(k),label:'Valor incluido',open:false});}return markers;}
 reset(){this.family='geometric';this.probability=.5;this.x=2;}

}
