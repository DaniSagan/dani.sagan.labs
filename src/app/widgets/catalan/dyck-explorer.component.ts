import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { dyckWords } from '../../shared/math/catalan';

@Component({
  selector: 'app-dyck-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './dyck-explorer.component.html', styleUrl: './catalan-widgets.css'
})
export class DyckExplorerComponent {
  n = 3; index = 0; step = 0; words: string[] = []; points = ''; prefixPoints = '';
  x = 45; y = 270; height = 0;
  readonly sizes = [0, 1, 2, 3, 4, 5, 6, 7];
  readonly ticks = [0, 1, 2, 3, 4, 5, 6, 7];
  constructor() { this.generate(); }
  get word(): string { return this.words[this.index]; }
  get prefix(): string { return this.word.slice(0, this.step); }
  generate(): void { this.words = dyckWords(this.n); this.index = 0; this.select(); }
  select(): void { this.step = 2 * this.n; this.draw(); }
  move(delta: number): void { this.index = Math.max(0, Math.min(this.words.length - 1, this.index + delta)); this.select(); }
  draw(): void {
    let height = 0;
    const points = ['45,270'];
    const heights = [0];
    for (let i = 0; i < this.word.length; i++) {
      height += this.word[i] === '(' ? 1 : -1;
      points.push(`${45 + (i + 1) * 590 / Math.max(1, 2 * this.n)},${270 - height * 30}`);
      heights.push(height);
    }
    this.points = points.join(' '); this.prefixPoints = points.slice(0, this.step + 1).join(' ');
    this.height = heights[this.step]; this.x = 45 + this.step * 590 / Math.max(1, 2 * this.n); this.y = 270 - this.height * 30;
  }
}
