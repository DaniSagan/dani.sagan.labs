import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-bolzano-theorem-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './bolzano-theorem-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class BolzanoTheoremArticleComponent {
  static title = "Teorema de Bolzano: existencia y unicidad de raíces";
  static route = 'bolzano-theorem';
  static description = "Separa existencia por Bolzano, unicidad por monotonía y aproximación certificada mediante bisección.";

  steps = 0;
  functionName = 'cubic';
  value(x: number): number { return this.functionName==='cubic'?x*x*x+x-1:x*x-1; }
  get bracket(): {a:number;b:number;mid:number;fa:number;fb:number;error:number;valid:boolean} {
    let a=.5,b=1;
    if(this.functionName!=='cubic') return {a:-2,b:2,mid:0,fa:3,fb:3,error:2,valid:false};
    for(let i=0;i<Number(this.steps);i++){const m=(a+b)/2;if(this.value(m)<0)a=m;else b=m;}
    return {a,b,mid:(a+b)/2,fa:this.value(a),fb:this.value(b),error:(b-a)/2,valid:true};
  }
  get curve(): string { return Array.from({length:101},(_,i)=>{const x=-2+4*i/100;const y=this.value(x);return (40+440*i/100)+','+(130-10*y);}).join(' '); }
}
