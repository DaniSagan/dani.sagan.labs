import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sandpile, SandpileRelaxation, sandpileRandom } from '../../shared/math/sandpile';
import { SandpileGridComponent } from './sandpile-grid.component';

@Component({
  selector: 'app-sandpile-abelian', standalone: true, imports: [CommonModule, FormsModule, SandpileGridComponent],
  templateUrl: './sandpile-abelian.component.html', styleUrl: './sandpile-widgets.css'
})
export class SandpileAbelianComponent implements OnDestroy {
  seed = 7; amount = 80; revision = 0; playing = false;
  left!: Sandpile; right!: Sandpile;
  leftJob!: SandpileRelaxation; rightJob!: SandpileRelaxation;
  private frame = 0;
  constructor() { this.reset(); }
  reset(): void {
    this.pause(); const rng = sandpileRandom(this.seed);
    const initial = Array.from({ length: 81 }, () => Math.floor(4 * rng()));
    initial[40] += this.amount; initial[30] += 12; initial[50] += 12;
    this.left = new Sandpile(9, initial); this.right = new Sandpile(9, initial);
    this.leftJob = new SandpileRelaxation(this.left, 'fifo', false);
    this.rightJob = new SandpileRelaxation(this.right, 'lifo', false);
    this.revision++;
  }
  get done(): boolean { return this.leftJob.done && this.rightJob.done; }
  get differences(): number { return this.left.heights.reduce((n, h, i) => n + (h !== this.right.heights[i] ? 1 : 0), 0); }
  get odometerDifferences(): number { return this.left.odometer.reduce((n, h, i) => n + (h !== this.right.odometer[i] ? 1 : 0), 0); }
  step(): void { this.pause(); this.advance(1); }
  private advance(count: number): void { this.leftJob.process(count); this.rightJob.process(count); this.revision++; }
  finish(): void {
    this.pause(); this.playing = true;
    const tick = () => {
      this.advance(200);
      if (this.done) this.playing = false;
      else this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  pause(): void { cancelAnimationFrame(this.frame); this.playing = false; }
  ngOnDestroy(): void { this.pause(); }
}
