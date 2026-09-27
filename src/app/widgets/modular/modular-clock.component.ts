import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClockOperation, clockFrames } from './modular.math';

@Component({
  selector: 'app-modular-clock',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modular-clock.component.html',
  styleUrls: ['./modular-widgets.css', './modular-clock.component.css'],
})
export class ModularClockComponent implements OnDestroy {
  n = 12;
  a = 10;
  b = 5;
  operation: ClockOperation = 'add';
  frames = clockFrames(this.a, this.b, this.n, this.operation);
  step = 0;
  error = '';
  private timer?: ReturnType<typeof setInterval>;
  get current() {
    return this.frames[this.step];
  }
  get playing(): boolean {
    return this.timer !== undefined;
  }
  get complete(): boolean {
    return this.step === this.frames.length - 1;
  }
  get points() {
    return Array.from({ length: this.error ? 0 : this.n }, (_, residue) => ({
      residue,
      x: 180 + 150 * Math.sin((residue * 2 * Math.PI) / this.n),
      y: 180 - 150 * Math.cos((residue * 2 * Math.PI) / this.n),
    }));
  }
  get symbol(): string {
    return { add: '+', subtract: '−', multiply: '×', power: '^' }[
      this.operation
    ];
  }
  update(): void {
    this.pause();
    this.step = 0;
    try {
      this.frames = clockFrames(this.a, this.b, this.n, this.operation);
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  preset(n: number, a: number, b: number, operation: ClockOperation): void {
    this.n = n;
    this.a = a;
    this.b = b;
    this.operation = operation;
    this.update();
  }
  move(delta: number): void {
    this.pause();
    this.step = Math.max(
      0,
      Math.min(this.frames.length - 1, this.step + delta),
    );
  }
  toggle(): void {
    if (this.playing) {
      this.pause();
      return;
    }
    if (this.error || this.complete) {
      return;
    }
    this.timer = setInterval(() => {
      this.step++;
      if (this.complete) {
        this.pause();
      }
    }, 700);
  }
  pause(): void {
    clearInterval(this.timer);
    this.timer = undefined;
  }
  ngOnDestroy(): void {
    this.pause();
  }
}
