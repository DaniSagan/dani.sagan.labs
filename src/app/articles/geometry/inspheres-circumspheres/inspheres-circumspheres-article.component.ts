import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { format } from '../foundations/geometry-lab';

@Component({
  selector: 'app-inspheres-circumspheres-article', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FormulaComponent],
  templateUrl: './inspheres-circumspheres-article.component.html',
  styleUrl: '../foundations/foundation-article.css',
})
export class InspheresCircumspheresArticleComponent {
  static title = 'Esferas inscritas y circunscritas';
  static route = 'inspheres-circumspheres';

  edge=2;
  get inradius(){return this.edge/2;}
  get circumradius(){return Math.sqrt(3)*this.edge/2;}
  get labValue(){return this.circumradius;}
  readonly Math=Math;
  readonly format=format;

}
