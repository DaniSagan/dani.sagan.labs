import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-telescoping-series-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './telescoping-series-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class TelescopingSeriesArticleComponent {
  static title = "Series telescópicas";
  static route = 'telescoping-series';
  static description = "Descompón los términos en diferencias y controla las sumas parciales, la frontera y el error restante.";

  count = 10;
  mode = 'convergent';
  get sum(): number { const n=Number(this.count);return this.mode==='convergent'?1-1/(n+1):-n; }
  get boundary(): number { return this.mode==='convergent'?1/(Number(this.count)+1):Number(this.count)+1; }
  get terms(): {n:number;value:number}[] { return Array.from({length:Math.min(Number(this.count),8)},(_,i)=>({n:i+1,value:this.mode==='convergent'?1/((i+1)*(i+2)):-1})); }
}
