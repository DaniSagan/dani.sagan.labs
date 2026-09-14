import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { binomialTerms } from './binomial.math';

@Component({
  selector: 'app-binomial-explorer', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './binomial-explorer.component.html',
  styleUrls: ['./binomial-widgets.css']
})
export class BinomialExplorerComponent {
  n = 4;
  a = 2;
  b = 1;
  k = 2;
  get terms() { return binomialTerms(this.n, this.a, this.b); }
  get selected() { return this.terms[this.k]; }
  get sum() { return this.terms.reduce((sum, term) => sum + term.value, 0); }
  get direct() { return (this.a + this.b) ** this.n; }
  get scale() { return Math.max(1, ...this.terms.map(term => Math.abs(term.value))); }
  get bars() {
    const step = 500 / (this.n + 1);
    const scale = this.scale;
    return this.terms.map(term => ({ ...term, x: 65 + term.k * step, width: step - 6,
      y: term.value >= 0 ? 140 - term.value / scale * 105 : 140,
      height: Math.abs(term.value) / scale * 105 }));
  }
  update() { this.k = Math.min(this.k, this.n); }
}
