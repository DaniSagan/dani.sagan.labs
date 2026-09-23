import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fourColorMap, solveMap } from '../../shared/math/four-color';
import { FourColorMapComponent } from './four-color-map.component';

@Component({
  selector: 'app-four-color-search',
  standalone: true,
  imports: [CommonModule, FormsModule, FourColorMapComponent],
  templateUrl: './four-color-search.component.html',
  styleUrl: './four-color-widgets.css',
})
export class FourColorSearchComponent implements OnDestroy {
  kind = 'four';
  k = 3;
  map = fourColorMap(this.kind);
  result = solveMap(this.map, this.k);
  step = 0;
  running = false;
  private timer?: ReturnType<typeof setInterval>;
  get frame() {
    return this.result.frames[this.step];
  }
  get finished(): boolean {
    return this.step === this.result.frames.length - 1;
  }
  reset(): void {
    this.pause();
    this.map = fourColorMap(this.kind);
    this.result = solveMap(this.map, Number(this.k));
    this.step = 0;
  }
  next(): void {
    this.step = Math.min(this.step + 1, this.result.frames.length - 1);
    if (this.finished) this.pause();
  }
  toggle(): void {
    if (this.running) {
      this.pause();
      return;
    }
    if (this.finished) this.step = 0;
    this.running = true;
    this.timer = setInterval(() => this.next(), 350);
  }
  pause(): void {
    clearInterval(this.timer);
    this.running = false;
  }
  ngOnDestroy(): void {
    this.pause();
  }
}
