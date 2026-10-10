import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-orthogonal-projections-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './orthogonal-projections-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class OrthogonalProjectionsArticleComponent {
  static title = "Proyecciones ortogonales y distancias en el espacio";
  static route = 'orthogonal-projections';
  static description = "Calcula el pie de la perpendicular y las distancias a planos o entre rectas, y verifica la ortogonalidad del residuo.";

  offset = 0;
  readonly point = [2,1,3];
  get multiplier(): number { return (6-Number(this.offset))/3; }
  get projection(): number[] { return this.point.map(v=>v-this.multiplier); }
  get distance(): number { return Math.abs(6-Number(this.offset))/Math.sqrt(3); }
  get check(): number { return this.projection.reduce((s,v)=>s+v,0)-Number(this.offset); }
}
