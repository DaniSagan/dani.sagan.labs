import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, polar, arc } from '../foundations/geometry-lab';

@Component({
  selector: 'app-complementary-supplementary-angles-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './complementary-supplementary-angles-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class ComplementarySupplementaryAnglesArticleComponent {
  static title = 'Ángulos complementarios y suplementarios';
  static route = 'complementary-supplementary-angles';

  total=90;angle=30;
  setTotal(value:number){this.total=value;this.angle=Math.min(this.angle,value);}
  get ray(){return polar(this.angle,110);}
  get end(){return polar(this.total,110);}
  get labValue(){return this.total-this.angle;}
  readonly Math=Math;
  readonly format=format;
  readonly polar=polar;
  readonly arc=arc;

}
