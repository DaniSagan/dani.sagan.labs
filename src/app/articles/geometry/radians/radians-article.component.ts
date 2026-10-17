import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, polar, arc } from '../foundations/geometry-lab';

@Component({
  selector: 'app-radians-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './radians-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class RadiansArticleComponent {
  static title = 'Radianes';
  static route = 'radians';

  angle=60;radius=2;
  get radians(){return this.angle*Math.PI/180;}
  get tip(){return polar(this.angle,110);}
  get labValue(){return this.radius*this.radians;}
  readonly Math=Math;
  readonly format=format;
  readonly polar=polar;
  readonly arc=arc;

}
