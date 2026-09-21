import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cycloidPoint, tautochroneTheta } from '../../shared/math/brachistochrone';

@Component({
  selector: 'app-tautochrone-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './tautochrone-explorer.component.html', styleUrl: './brachistochrone-widgets.css'
})
export class TautochroneExplorerComponent implements OnDestroy {
  radius = 1; start = 0.65; phase = 0; playing = false;
  readonly colors = ['#82e3cc', '#f6cc80', '#c5a6ff'];
  readonly path = Array.from({ length: 201 }, (_, i) => {
    const p = cycloidPoint(190, Math.PI * i / 200);
    return `${i ? 'L' : 'M'}${65 + p.x},${35 + p.y}`;
  }).join(' ');
  private frame = 0;
  get starts(): number[] { return [this.start, 1.65, 2.5]; }
  get arrival(): number { return Math.PI * Math.sqrt(this.radius / 9.81); }
  point(start: number, phase = this.phase) { const p = cycloidPoint(190, tautochroneTheta(start, phase)); return { x: 65 + p.x, y: 35 + p.y }; }
  remaining(start: number): number { return 4 * this.radius * Math.cos(tautochroneTheta(start, this.phase) / 2); }
  seek(value: number): void { this.pause(); this.phase = +value; }
  reset(): void { this.pause(); this.phase = 0; }
  pause(): void { cancelAnimationFrame(this.frame); this.playing = false; }
  toggle(): void {
    if (this.playing) { this.pause(); return; }
    if (this.phase >= 1) this.phase = 0;
    this.playing = true;
    let previous = performance.now();
    const tick = (now: number) => {
      this.phase = Math.min(1, this.phase + Math.min((now - previous) / 1000, 0.1) / (2 * this.arrival));
      previous = now;
      if (this.phase >= 1) this.playing = false;
      else this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  ngOnDestroy(): void { this.pause(); }
}
