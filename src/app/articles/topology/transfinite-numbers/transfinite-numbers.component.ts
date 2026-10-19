import { Component } from '@angular/core';
import { HydraLabComponent } from './hydra-lab.component';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
@Component({selector: 'app-transfinite-numbers', standalone: true, imports: [...LEARNING_IMPORTS, HydraLabComponent], templateUrl: './transfinite-numbers.component.html', styleUrls: ['../../shared/learning-article.css', './transfinite-numbers.component.css']})
export class TransfiniteNumbersComponent {
  static readonly title = 'Números transfinitos: un viaje por los tamaños y órdenes del infinito';
  static readonly route = 'transfinite-numbers';
  hotel = 'one';
  size = 6;
  order = 'omega+1';
  readonly rooms = [1,2,3,4,5,6];
  bits = Array.from({length: 6}, (_, i) => Array.from({length: 6}, (_, j) => (i + j * 3 + (i === j ? 1 : 0)) % 2));
  get diagonal(): number[] { return this.bits.map((row, i) => 1 - row[i]); }
  destination(n: number): number { return this.hotel === 'one' ? n + 1 : this.hotel === 'finite' ? n + this.size : 2 * n; }
  toggle(i: number, j: number): void { this.bits[i][j] = 1 - this.bits[i][j]; }
  get blocks(): string[] { return this.order === 'omega*2' ? ['0, 1, 2, 3, …', '0′, 1′, 2′, 3′, …'] : this.order === '1+omega' ? ['★', '0, 1, 2, 3, …'] : ['0, 1, 2, 3, …', '★']; }
  reset(): void { this.hotel = 'one'; this.size = 6; this.order = 'omega+1'; this.bits = Array.from({length: 6}, (_, i) => Array.from({length: 6}, (_, j) => (i + j * 3 + (i === j ? 1 : 0)) % 2)); }
}
