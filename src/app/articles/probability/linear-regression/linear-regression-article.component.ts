import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-linear-regression-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './linear-regression-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class LinearRegressionArticleComponent {
  static title = "Regresión lineal y correlación de Pearson";
  static route = 'linear-regression';
  static description = "Calcula mínimos cuadrados y Pearson, inspecciona los residuos y compara nubes con resúmenes similares.";

  dataset = 'problem';
  outlier = 0;
  get data(): {x:number;y:number}[] {
    if(this.dataset==='problem') return [{x:1,y:2},{x:2,y:2},{x:3,y:5+Number(this.outlier)}];
    if(this.dataset==='constant-x') return [{x:2,y:1},{x:2,y:2},{x:2,y:3}];
    if(this.dataset==='constant-y') return [{x:1,y:2},{x:2,y:2},{x:3,y:2}];
    return Array.from({length:9},(_,i)=>({x:i-4,y:(i-4)**2}));
  }
  get fit(): {mx:number;my:number;sxx:number;syy:number;sxy:number;slope:number|null;intercept:number|null;r:number|null;sse:number} {
    const pts=this.data,n=pts.length,mx=pts.reduce((s,p)=>s+p.x,0)/n,my=pts.reduce((s,p)=>s+p.y,0)/n;
    const sxx=pts.reduce((s,p)=>s+(p.x-mx)**2,0),syy=pts.reduce((s,p)=>s+(p.y-my)**2,0),sxy=pts.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0);
    const slope=sxx>0?sxy/sxx:null,intercept=slope===null?null:my-slope*mx;
    const sse=pts.reduce((s,p)=>s+(p.y-(intercept===null?my:intercept+slope!*p.x))**2,0);
    return {mx,my,sxx,syy,sxy,slope,intercept,r:sxx>0&&syy>0?sxy/Math.sqrt(sxx*syy):null,sse};
  }
  px(x:number): number { return 40+(x+4)*55; }
  py(y:number): number { return 220-y*10; }
  get fitLine(): string { const fit=this.fit;return fit.slope===null?'':this.px(-4)+','+this.py(fit.intercept!+fit.slope*(-4))+' '+this.px(4)+','+this.py(fit.intercept!+fit.slope*4); }
}
