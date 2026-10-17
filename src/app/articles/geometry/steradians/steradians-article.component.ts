import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format } from '../foundations/geometry-lab';

@Component({
  selector: 'app-steradians-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './steradians-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class SteradiansArticleComponent {
  static title = 'Estereorradianes y ángulo sólido';
  static route = 'steradians';

  angle=45;radius=2;
  get alpha(){return this.angle*Math.PI/180;}
  get capY(){return 160-110*Math.cos(this.alpha);}
  get capX(){return 110*Math.sin(this.alpha);}
  get capPath(){const x=this.capX,y=this.capY;return 'M '+(200-x)+' '+y+' A 110 110 0 0 1 '+(200+x)+' '+y+' A '+x+' '+(x*0.28)+' 0 0 1 '+(200-x)+' '+y;}
  get labValue(){return 2*Math.PI*(1-Math.cos(this.alpha));}
  readonly Math=Math;
  readonly format=format;

}
