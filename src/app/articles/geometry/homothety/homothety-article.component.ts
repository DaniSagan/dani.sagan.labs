import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format, points, Point2 } from '../foundations/geometry-lab';

@Component({
  selector: 'app-homothety-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './homothety-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class HomothetyArticleComponent {
  static title = 'Homotecia';
  static route = 'homothety';

  ratio=1.5;
  readonly center:Point2=[180,180];
  readonly original:Point2[]=[[230,130],[260,180],[190,210]];
  get image(){return this.original.map(p=>[180+this.ratio*(p[0]-180),180+this.ratio*(p[1]-180)] as Point2);}
  get labValue(){return this.ratio;}
  readonly Math=Math;
  readonly format=format;
  readonly points=points;

}
