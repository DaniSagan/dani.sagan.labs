import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { binomialChoices } from './binomial.math';

@Component({
  selector: 'app-binomial-choices', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './binomial-choices.component.html',
  styleUrls: ['./binomial-widgets.css']
})
export class BinomialChoicesComponent {
  n = 4;
  letters = ['a', 'a', 'b', 'b'];
  get k() { return this.letters.filter(letter => letter === 'b').length; }
  get word() { return this.letters.join(''); }
  get choices() { return binomialChoices(this.n, this.k); }
  get total() { return 2 ** this.n; }
  update() { this.letters = Array.from({ length: this.n }, (_, i) => this.letters[i] ?? 'a'); }
  toggle(index: number) { this.letters[index] = this.letters[index] === 'a' ? 'b' : 'a'; }
  select(word: string) { this.letters = word.split(''); }
  trackIndex(index: number) { return index; }
}
