import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FourierWave, fourierCoefficients, fourierSum, waveValue } from './fourier.math';

@Component({
  selector: 'app-fourier-explorer', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fourier-explorer.component.html', styleUrls: ['./fourier-explorer.component.css']
})
export class FourierExplorerComponent implements OnInit {
  @Input() gibbs = false;
  wave: FourierWave = 'square';
  maximum = 5;
  halfWidth = 0.5;
  point = 0.5;
  showFejer = false;
  coefficients: number[] = [];
  curve = '';
  targetCurve = '';
  fejerCurve = '';
  readonly yTicks = [-1, 0, 1];
  ngOnInit() { if (this.gibbs) { this.maximum = 19; } this.update(); }
  get extent() { return this.gibbs ? this.halfWidth : Math.PI; }
  get actual() { return waveValue(this.wave, this.point); }
  get approximation() { return fourierSum(this.coefficients, this.point); }
  get peakX() { return Math.PI / (2 * Math.ceil(this.maximum / 2)); }
  get peak() { return fourierSum(this.coefficients, this.peakX); }
  px(x: number) { return 50 + 540 * (x + this.extent) / (2 * this.extent); }
  py(y: number) { return 155 - 90 * y; }
  update() {
    if (this.gibbs) { this.wave = 'square'; }
    this.coefficients = fourierCoefficients(this.wave, this.maximum);
    this.curve = this.sample(x => fourierSum(this.coefficients, x));
    this.fejerCurve = this.sample(x => fourierSum(this.coefficients, x, true));
    // Draw each continuous branch separately, never a line across a jump.
    this.targetCurve = this.wave === 'square'
      ? `M${this.px(-this.extent)},${this.py(-1)} H${this.px(0)} M${this.px(0)},${this.py(1)} H${this.px(this.extent)}`
      : this.wave === 'saw'
      ? `M${this.px(-Math.PI)},${this.py(-1)} L${this.px(Math.PI)},${this.py(1)}`
      : this.sample(x => waveValue(this.wave, x));
  }
  private sample(fn: (x: number) => number): string {
    return Array.from({ length: 1001 }, (_, i) => {
      const x = -this.extent + 2 * this.extent * i / 1000;
      return `${i ? 'L' : 'M'}${this.px(x)},${this.py(fn(x))}`;
    }).join(' ');
  }
}
