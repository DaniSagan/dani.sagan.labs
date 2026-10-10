import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-series-convergence-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './series-convergence-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class SeriesConvergenceArticleComponent {
  static title = "Convergencia absoluta, condicional y criterio de Leibniz";
  static route = 'series-convergence';
  static description = "Aplica Leibniz, distingue convergencia absoluta y condicional y acota el error de la suma parcial.";

  exponent = .5;
  count = 50;
  get sums(): {signed:number;absolute:number} {
    let signed=0,absolute=0;
    for(let n=1;n<=Number(this.count);n++){const t=1/n**Number(this.exponent);signed+=(n%2?1:-1)*t;absolute+=t;}
    return {signed,absolute};
  }
  get bound(): number { return 1/(Number(this.count)+1)**Number(this.exponent); }
  get classification(): string { return Number(this.exponent)>1?'Convergencia absoluta':'Convergencia condicional'; }
  get points(): string {
    let s=0;const n=Number(this.count);
    return Array.from({length:n},(_,i)=>{s+=(i%2? -1:1)/(i+1)**Number(this.exponent);return (40+440*i/Math.max(1,n-1))+','+(220-150*s);}).join(' ');
  }
}
