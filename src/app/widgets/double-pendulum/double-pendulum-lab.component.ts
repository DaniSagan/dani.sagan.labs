import { CommonModule } from '@angular/common';
import { Component, HostListener, NgZone, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_PENDULUM,
  PendulumParameters,
  PendulumState,
  normalModeState,
  pendulumDistance,
  pendulumEnergy,
  pendulumPositions,
  pendulumStep,
  wrapAngle,
} from '../../shared/math/double-pendulum';

interface PendulumSample {
  time: number;
  state: PendulumState;
  twin: PendulumState;
  kinetic: number;
  potential: number;
  total: number;
  separation: number;
  numerical: number;
}

@Component({
  selector: 'app-double-pendulum-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './double-pendulum-lab.component.html',
  styleUrl: './double-pendulum-widgets.css',
})
export class DoublePendulumLabComponent implements OnDestroy {
  parameters: PendulumParameters = { ...DEFAULT_PENDULUM };
  angle1 = 120;
  angle2 = -10;
  velocity1 = 0;
  velocity2 = 0;
  epsilon = 0.01;
  frequency = 240;
  speed = 1;
  compare = true;
  trail = true;
  running = false;
  time = 0;
  message = '';
  state: PendulumState = [0, 0, 0, 0];
  twin: PendulumState = [0, 0, 0, 0];
  reference: PendulumState = [0, 0, 0, 0];
  initialEnergy = 0;
  samples: PendulumSample[] = [];
  tab = 'energy';
  phaseBob = 0;
  trailA = '';
  trailB = '';
  kineticPath = '';
  potentialPath = '';
  totalPath = '';
  separationPath = '';
  numericalPath = '';
  phasePath = '';
  energyScale = 1;
  phaseScale = 1;
  readonly parameterControls = [
    { key: 'm1' as const, label: 'Masa m₁ (kg)', min: 0.5, max: 3 },
    { key: 'm2' as const, label: 'Masa m₂ (kg)', min: 0.5, max: 3 },
    { key: 'l1' as const, label: 'Longitud ℓ₁ (m)', min: 0.5, max: 2 },
    { key: 'l2' as const, label: 'Longitud ℓ₂ (m)', min: 0.5, max: 2 },
  ];
  private frame = 0;
  private previous = 0;
  private accumulator = 0;
  private steps = 0;
  private dragging = 0;
  constructor(private zone: NgZone) {
    this.reset();
  }
  get scale() {
    return 200 / (this.parameters.l1 + this.parameters.l2);
  }
  get position() {
    return pendulumPositions(this.state, this.parameters);
  }
  get otherPosition() {
    return pendulumPositions(this.twin, this.parameters);
  }
  get energy() {
    return pendulumEnergy(this.state, this.parameters);
  }
  get energyUnit() {
    const p = this.parameters;
    return (p.m1 + p.m2) * p.g * p.l1 + p.m2 * p.g * p.l2;
  }
  get drift() {
    return (this.energy.total - this.initialEnergy) / this.energyUnit;
  }
  get separation() {
    return pendulumDistance(this.state, this.twin, this.parameters);
  }
  get numerical() {
    return pendulumDistance(this.state, this.reference, this.parameters);
  }
  get startTime() {
    return this.samples[0]?.time ?? 0;
  }
  sx(x: number) {
    return 300 + this.scale * x;
  }
  sy(y: number) {
    return 250 - this.scale * y;
  }
  fmt(n: number, digits = 3) {
    return n.toLocaleString('es-ES', { maximumFractionDigits: digits });
  }
  scientific(n: number) {
    return n.toExponential(2);
  }
  reset() {
    this.pause();
    this.time = 0;
    this.steps = 0;
    this.accumulator = 0;
    this.message = '';
    this.state = [
      (this.angle1 * Math.PI) / 180,
      (this.angle2 * Math.PI) / 180,
      this.velocity1,
      this.velocity2,
    ];
    this.twin = [...this.state];
    this.twin[1] += (this.epsilon * Math.PI) / 180;
    this.reference = [...this.state];
    this.initialEnergy = this.energy.total;
    this.samples = [];
    this.record();
  }
  preset(kind: string) {
    this.parameters = { ...DEFAULT_PENDULUM };
    this.velocity1 = 0;
    this.velocity2 = 0;
    if (kind === 'quiet') {
      this.angle1 = 12;
      this.angle2 = 0;
    } else if (kind === 'slow' || kind === 'fast') {
      const state = normalModeState(
        0,
        (8 * Math.PI) / 180,
        kind === 'slow' ? 0 : 1,
      );
      this.angle1 = (state[0] * 180) / Math.PI;
      this.angle2 = (state[1] * 180) / Math.PI;
    } else if (kind === 'rotate') {
      this.angle1 = 90;
      this.angle2 = 90;
      this.velocity2 = 6;
    } else {
      this.angle1 = 120;
      this.angle2 = -10;
    }
    this.reset();
  }
  advance(count: number) {
    const h = 1 / this.frequency;
    for (let i = 0; i < count && this.time < 120; i++) {
      this.state = pendulumStep(this.state, this.parameters, h);
      this.twin = pendulumStep(this.twin, this.parameters, h);
      this.reference = pendulumStep(
        pendulumStep(this.reference, this.parameters, h / 2),
        this.parameters,
        h / 2,
      );
      this.steps++;
      this.time = this.steps / this.frequency;
      if (
        ![...this.state, ...this.twin, ...this.reference].every(Number.isFinite)
      ) {
        this.pause();
        this.message = 'Límite numérico alcanzado. Reinicia con un paso menor.';
        break;
      }
      if (this.steps % (this.frequency / 30) === 0) this.record();
    }
    if (this.time >= 120) {
      this.pause();
      this.message =
        'Se han completado 120 segundos simulados. Reinicia para repetir el experimento.';
    }
  }
  singleStep() {
    this.pause();
    this.advance(this.frequency / 30);
  }
  play() {
    if (this.running || this.time >= 120 || this.message) return;
    this.running = true;
    this.previous = 0;
    this.zone.runOutsideAngular(() => {
      const animate = (stamp: number) => {
        if (!this.running) return;
        if (this.previous)
          this.accumulator +=
            Math.min(0.05, (stamp - this.previous) / 1000) * this.speed;
        this.previous = stamp;
        const count = Math.floor(this.accumulator * this.frequency);
        this.accumulator -= count / this.frequency;
        if (count) this.zone.run(() => this.advance(count));
        if (this.running) this.frame = requestAnimationFrame(animate);
      };
      this.frame = requestAnimationFrame(animate);
    });
  }
  pause() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.previous = 0;
  }
  @HostListener('document:visibilitychange') visibility() {
    if (document.hidden) this.pause();
  }
  startDrag(event: PointerEvent, bob: number, svg: Element) {
    event.preventDefault();
    this.pause();
    this.dragging = bob;
    svg.setPointerCapture(event.pointerId);
    this.drag(event, svg);
  }
  drag(event: PointerEvent, element: Element) {
    if (!this.dragging) return;
    const svg = element as SVGSVGElement;
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    let x = (point.x - 300) / this.scale,
      y = (point.y - 250) / this.scale;
    if (this.dragging === 2) {
      x -= this.parameters.l1 * Math.sin((this.angle1 * Math.PI) / 180);
      y -= this.parameters.l1 * Math.cos((this.angle1 * Math.PI) / 180);
    }
    const angle = (Math.atan2(x, y) * 180) / Math.PI;
    if (this.dragging === 1) this.angle1 = angle;
    else this.angle2 = angle;
    this.velocity1 = 0;
    this.velocity2 = 0;
    this.reset();
  }
  endDrag() {
    this.dragging = 0;
  }
  record() {
    this.samples.push({
      time: this.time,
      state: [...this.state],
      twin: [...this.twin],
      ...this.energy,
      separation: this.separation,
      numerical: this.numerical,
    });
    if (this.samples.length > 1801) this.samples.shift();
    this.refreshCharts();
  }
  refreshCharts() {
    const samples = this.samples,
      start = samples[0]?.time ?? 0,
      duration = Math.max(1, this.time - start);
    const path = (value: (s: PendulumSample) => number) =>
      samples
        .map(
          (s, i) =>
            `${i ? 'L' : 'M'}${(45 + (510 * (s.time - start)) / duration).toFixed(2)},${value(s).toFixed(2)}`,
        )
        .join(' ');
    this.energyScale = Math.max(1, ...samples.map((s) => s.total)) * 1.1;
    this.kineticPath = path((s) => 220 - (185 * s.kinetic) / this.energyScale);
    this.potentialPath = path(
      (s) => 220 - (185 * s.potential) / this.energyScale,
    );
    this.totalPath = path((s) => 220 - (185 * s.total) / this.energyScale);
    const logY = (value: number) =>
      220 -
      (185 * (Math.log10(Math.max(1e-12, Math.min(100, value))) + 12)) / 14;
    this.separationPath = path((s) => logY(s.separation));
    this.numericalPath = path((s) => logY(s.numerical));
    const bob = this.phaseBob;
    this.phaseScale =
      Math.max(1, ...samples.map((s) => Math.abs(s.state[bob + 2]))) * 1.1;
    this.phasePath = samples
      .map((s, i) => {
        const angle = wrapAngle(s.state[bob]);
        const jump =
          i && Math.abs(angle - wrapAngle(samples[i - 1].state[bob])) > Math.PI;
        return `${i && !jump ? 'L' : 'M'}${(300 + (250 * angle) / Math.PI).toFixed(2)},${(130 - (95 * s.state[bob + 2]) / this.phaseScale).toFixed(2)}`;
      })
      .join(' ');
    const tail = samples.slice(-301);
    const trail = (twin: boolean) =>
      tail
        .map((s, i) => {
          const p = pendulumPositions(twin ? s.twin : s.state, this.parameters);
          return `${i ? 'L' : 'M'}${this.sx(p.x2).toFixed(2)},${this.sy(p.y2).toFixed(2)}`;
        })
        .join(' ');
    this.trailA = trail(false);
    this.trailB = trail(true);
  }
  exportCsv() {
    const lines = [
      `# m1=${this.parameters.m1};m2=${this.parameters.m2};l1=${this.parameters.l1};l2=${this.parameters.l2};g=${this.parameters.g};h=${1 / this.frequency};epsilon_deg=${this.epsilon}`,
      't_s,theta1_rad,theta2_rad,omega1_rad_s,omega2_rad_s,K_J,U_J,E_J,separation,numerical_distance',
      ...this.samples.map((s) =>
        [
          s.time,
          ...s.state,
          s.kinetic,
          s.potential,
          s.total,
          s.separation,
          s.numerical,
        ].join(','),
      ),
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pendulo-doble.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
  ngOnDestroy() {
    this.pause();
  }
}
