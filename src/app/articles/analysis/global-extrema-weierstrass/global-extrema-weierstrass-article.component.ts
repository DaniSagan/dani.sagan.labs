import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';

@Component({
 selector: 'app-global-extrema-weierstrass-article', standalone: true,
 imports: [...LEARNING_IMPORTS],
 templateUrl: './global-extrema-weierstrass-article.component.html',
 styleUrls: ['../../shared/learning-article.css'],
})
export class GlobalExtremaWeierstrassArticleComponent {
 static readonly title = "Extremos globales y teorema de Weierstrass";
 static readonly route = 'global-extrema-weierstrass';

 mode='closed';
 get summary(){return this.mode==='closed'?'En [0,2], x² alcanza mínimo 0 y máximo 4.':this.mode==='open'?'En (0,2), el ínfimo es 0 y el supremo 4; ninguno se alcanza.':this.mode==='unbounded'?'En [0,∞), x² alcanza mínimo 0, pero no está acotada superiormente.':'En [0,2], f(0)=1 y f(x)=x para x>0: ínfimo 0 no alcanzado y máximo 2.';}
 get series(): PlotSeries[]{const limit=this.mode==='unbounded'?3:2;return [{label:this.mode==='discontinuous'?'f(0)=1; f(x)=x para x>0':'f(x)=x²',points:Array.from({length:80},(_,i)=>{const x=limit*(i+1)/80;return [x,this.mode==='discontinuous'?x:x*x] as [number,number];})}];}
 get markers(){if(this.mode==='discontinuous')return [{x:0,y:0,label:'Valor límite excluido',open:true},{x:0,y:1,label:'Valor en cero'},{x:2,y:2,label:'Máximo'}];return [{x:0,y:0,label:'Extremo izquierdo',open:this.mode==='open'},...(this.mode==='unbounded'?[]:[{x:2,y:4,label:'Extremo derecho',open:this.mode==='open'}])];}
 reset(){this.mode='closed';}

}
