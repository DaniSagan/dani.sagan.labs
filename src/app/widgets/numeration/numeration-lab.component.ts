import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { absolute } from '../euclid/euclid.math';
import {
  binaryGroups,
  digitCount,
  divisionDigits,
  encodeNumeral,
  hornerTrace,
  parseNumeral,
  positionalTerms,
} from './numeration.math';

@Component({
  selector: 'app-numeration-lab',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './numeration-lab.component.html',
  styleUrls: ['../modular/modular-widgets.css', './numeration-widgets.css'],
})
export class NumerationLabComponent {
  input = '156';
  source = 10;
  target = 2;
  error = '';
  value = 156n;
  magnitude = 156n;
  output = '10011100';
  divisions = divisionDigits(156n, 2);
  terms = positionalTerms(156n, 10);
  horner = hornerTrace(156n, 10);
  step = 0;
  selected = 0;
  hornerStep = 0;
  blockSize: 3 | 4 = 4;
  groups = binaryGroups(156n, 4);
  readonly bases = Array.from({ length: 35 }, (_, i) => i + 2);
  readonly commonBases = [2, 3, 5, 8, 10, 16];
  equivalents: { base: number; text: string; length: number }[] = [];
  constructor() {
    this.update();
  }
  update(): void {
    this.step = 0;
    this.selected = 0;
    this.hornerStep = 0;
    try {
      this.value = parseNumeral(this.input, this.source);
      this.magnitude = absolute(this.value);
      this.output = encodeNumeral(this.value, this.target);
      this.divisions = divisionDigits(this.value, this.target);
      this.terms = positionalTerms(this.value, this.source);
      this.horner = hornerTrace(this.value, this.source);
      this.equivalents = this.commonBases.map((base) => ({
        base,
        text: encodeNumeral(this.value, base),
        length: digitCount(this.value, base),
      }));
      this.group();
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  preset(input: string, source: number, target: number): void {
    this.input = input;
    this.source = source;
    this.target = target;
    this.update();
  }
  move(delta: number): void {
    this.step = Math.max(
      0,
      Math.min(this.divisions.length - 1, this.step + delta),
    );
  }
  moveHorner(delta: number): void {
    this.hornerStep = Math.max(
      0,
      Math.min(this.horner.length - 1, this.hornerStep + delta),
    );
  }
  get rows() {
    return this.divisions.slice(Math.max(0, this.step - 7), this.step + 1);
  }
  get suffix(): string {
    return this.divisions
      .slice(0, this.step + 1)
      .reverse()
      .map((r) => r.symbol)
      .join('');
  }
  get place() {
    return this.terms[this.selected];
  }
  get hornerRows() {
    return this.horner.slice(
      Math.max(0, this.hornerStep - 7),
      this.hornerStep + 1,
    );
  }
  group(): void {
    this.groups = binaryGroups(this.value, this.blockSize);
  }
}
