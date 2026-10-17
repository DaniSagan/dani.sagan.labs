import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, polar, arc } from '../foundations/geometry-lab';

@Component({
  selector: 'app-dihedral-angle-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './dihedral-angle-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class DihedralAngleArticleComponent {
  static title = 'Ángulo diedro';
  static route = 'dihedral-angle';

  angle=110;
  get ray(){return polar(this.angle,115);}
  get labValue(){return 180-this.angle;}
  readonly Math=Math;
  readonly format=format;
  readonly polar=polar;
  readonly arc=arc;

}
