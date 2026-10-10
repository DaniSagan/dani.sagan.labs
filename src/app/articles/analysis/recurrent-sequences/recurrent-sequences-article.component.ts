import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-recurrent-sequences-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './recurrent-sequences-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class RecurrentSequencesArticleComponent {
  static title = "Sucesiones recurrentes y puntos fijos";
  static route = 'recurrent-sequences';
  static description = "Distingue candidatos a límite de pruebas de convergencia mediante monotonía, acotación y contracciones.";

  mode = 'radical';
  count = 12;
  get terms(): number[] {
    const values=[this.mode==='radical'?1:this.mode==='affine'?5:1];
    for(let n=0;n<Number(this.count);n++){const x=values[values.length-1];values.push(this.mode==='radical'?Math.sqrt(2+x):this.mode==='affine'?(x+6)/3:1-x);}
    return values;
  }
  get target(): number { return this.mode==='radical'?2:this.mode==='affine'?3:.5; }
  get points(): string { return this.terms.map((x,i)=>(40+440*i/Number(this.count))+','+(220-34*x)).join(' '); }
  get error(): number { return Math.abs(this.terms[this.terms.length-1]-this.target); }
}
