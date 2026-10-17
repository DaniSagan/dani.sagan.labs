import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, polar, arc } from '../foundations/geometry-lab';

@Component({
  selector: 'app-dot-product-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './dot-product-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class DotProductArticleComponent {
  static title = 'Producto escalar';
  static route = 'dot-product';

  angle=60;
  get v(){return polar(this.angle,120);}
  get foot(){return polar(0,120*Math.cos(this.angle*Math.PI/180));}
  get labValue(){return 6*Math.cos(this.angle*Math.PI/180);}
  readonly Math=Math;
  readonly format=format;
  readonly polar=polar;
  readonly arc=arc;

}
