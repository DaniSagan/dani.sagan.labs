import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_PENDULUM,
  PendulumState,
  pendulumEnergy,
  pendulumMomentum,
  pendulumSection,
  pendulumStep,
  wrapAngle,
} from '../../shared/math/double-pendulum';

interface SectionPoint {
  angle: number;
  momentum: number;
  orbit: number;
}
@Component({
  selector: 'app-double-pendulum-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './double-pendulum-section.component.html',
  styleUrl: './double-pendulum-widgets.css',
})
export class DoublePendulumSectionComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  energyLevel = 4;
  duration = 180;
  frequency = 240;
  running = false;
  progress = 0;
  maxDrift = 0;
  message = '';
  points: SectionPoint[] = [];
  initialStates: PendulumState[] = [];
  readonly colors = ['#82e3cc', '#f6cc80', '#c5a6ff', '#ff9eae', '#7dbbff'];
  private frame = 0;
  private ready = false;
  constructor(private zone: NgZone) {}
  ngOnInit() {
    this.ready = true;
    this.start();
  }
  get momentumLimit() {
    return 2 * Math.sqrt(this.energyLevel);
  }
  configure() {
    this.stop();
    this.points = [];
    this.initialStates = [];
    this.progress = 0;
    this.maxDrift = 0;
    this.message = 'Parámetros cambiados. Pulsa «Calcular sección».';
    this.draw();
  }
  start() {
    if (!this.ready) return;
    this.stop();
    this.points = [];
    this.maxDrift = 0;
    this.progress = 0;
    this.message = '';
    this.running = true;
    const p = DEFAULT_PENDULUM,
      energy = this.energyLevel * p.g;
    const maxAngle =
      this.energyLevel < 4 ? Math.acos(1 - this.energyLevel / 2) : Math.PI;
    this.initialStates = [0.1, 0.3, 0.5, 0.7, 0.9].map((fraction) => {
      const angle = maxAngle * fraction,
        potential = 2 * p.g * (1 - Math.cos(angle));
      return [
        angle,
        0,
        0,
        Math.sqrt(2 * Math.max(0, energy - potential)),
      ] as PendulumState;
    });
    const states = this.initialStates.map((s) => [...s] as PendulumState);
    const h = 1 / this.frequency,
      total = Math.round(this.duration * this.frequency);
    let step = 0;
    this.draw();
    this.zone.runOutsideAngular(() => {
      const chunk = () => {
        const begin = performance.now();
        do {
          for (let orbit = 0; orbit < states.length; orbit++) {
            const before = states[orbit],
              after = pendulumStep(before, p, h);
            const crossing = pendulumSection(before, after, p, h);
            if (crossing)
              this.points.push({
                angle: wrapAngle(crossing[0]),
                momentum: pendulumMomentum(crossing, p) / Math.sqrt(p.g),
                orbit,
              });
            states[orbit] = after;
            if (step % 120 === 0)
              this.maxDrift = Math.max(
                this.maxDrift,
                Math.abs(pendulumEnergy(after, p).total - energy) / (3 * p.g),
              );
          }
          step++;
        } while (step < total && performance.now() - begin < 12);
        this.draw();
        this.zone.run(() => {
          this.progress = Math.round((100 * step) / total);
          this.running = step < total;
        });
        if (step < total) this.frame = requestAnimationFrame(chunk);
      };
      this.frame = requestAnimationFrame(chunk);
    });
  }
  stop() {
    cancelAnimationFrame(this.frame);
    this.running = false;
  }
  draw() {
    if (!this.ready) return;
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) {
      this.message = 'No se ha podido iniciar el lienzo 2D.';
      this.stop();
      return;
    }
    ctx.fillStyle = '#0a141c';
    ctx.fillRect(0, 0, 640, 440);
    for (const point of this.points) {
      ctx.fillStyle = this.colors[point.orbit];
      ctx.beginPath();
      ctx.arc(
        320 + (270 * point.angle) / Math.PI,
        210 - (170 * point.momentum) / this.momentumLimit,
        1.6,
        0,
        2 * Math.PI,
      );
      ctx.fill();
    }
  }
  exportCsv() {
    const lines = [
      `# E_mgL=${this.energyLevel};duration_s=${this.duration};h=${1 / this.frequency};progress_percent=${this.progress};m1=m2=1;l1=l2=1;g=9.81`,
      'orbit,theta1_rad,p1_normalized',
      ...this.points.map((p) => [p.orbit + 1, p.angle, p.momentum].join(',')),
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'seccion-pendulo-doble.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
  ngOnDestroy() {
    this.stop();
  }
}
