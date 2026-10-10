import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-cauchy-schwarz-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './cauchy-schwarz-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class CauchySchwarzArticleComponent {
  static title = "Desigualdad de Cauchy–Schwarz";
  static route = 'cauchy-schwarz';
  static description = "Demuestra la desigualdad de recíprocos con Cauchy–Schwarz y comprueba cuándo se alcanza la igualdad.";

  angle = 35;
  get cosine(): number { return Math.cos(this.angle * Math.PI / 180); }
  get sine(): number { return Math.sin(this.angle * Math.PI / 180); }
  get gap(): number { return 1-this.cosine**2; }
}
