import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-simpson-paradox-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './simpson-paradox-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class SimpsonParadoxArticleComponent {
  static title = "Paradoja de Simpson";
  static route = 'simpson-paradox';
  static description = "Explica la inversión de tasas al agregar grupos y compara las alternativas con pesos de población comunes.";

  weightA = 100/11;
  weightB = 1000/11;
  standardWeight = 50;
  get rateA(): number { return .3+.6*Number(this.weightA)/100; }
  get rateB(): number { return .2+.6*Number(this.weightB)/100; }
  get standardizedA(): number { return .3+.6*Number(this.standardWeight)/100; }
  get standardizedB(): number { return .2+.6*Number(this.standardWeight)/100; }
  get verdict(): string { return Math.abs(this.rateA-this.rateB)<1e-10?'Las tasas agregadas empatan':this.rateA>this.rateB?'A supera a B en el agregado':'B supera a A en el agregado: inversión de Simpson'; }
  reset(): void { this.weightA=100/11;this.weightB=1000/11;this.standardWeight=50; }
}
