import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DEFAULT_PENDULUM,
  normalModeState,
  pendulumPositions,
  pendulumStep,
  PendulumState,
} from '../../shared/math/double-pendulum';

@Component({
  selector: 'app-double-pendulum-modes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './double-pendulum-modes.component.html',
  styleUrl: './double-pendulum-widgets.css',
})
export class DoublePendulumModesComponent {
  amplitude = 8;
  mix = 0;
  time = 0;
  readonly low = Math.sqrt(9.81 * (2 - Math.SQRT2));
  readonly high = Math.sqrt(9.81 * (2 + Math.SQRT2));
  trajectory: PendulumState[] = [];
  angle1Path = '';
  angle2Path = '';
  constructor() {
    this.rebuild();
  }
  get linear() {
    return normalModeState(
      this.time,
      (this.amplitude * Math.PI) / 180,
      this.mix,
    );
  }
  get exact() {
    return this.trajectory[Math.round(this.time * 30)] ?? this.trajectory[0];
  }
  get positions() {
    return [
      pendulumPositions(this.linear, DEFAULT_PENDULUM),
      pendulumPositions(this.exact, DEFAULT_PENDULUM),
    ];
  }
  get difference() {
    return (
      (Math.hypot(
        this.linear[0] - this.exact[0],
        this.linear[1] - this.exact[1],
      ) *
        180) /
      Math.PI
    );
  }
  rebuild() {
    let state = normalModeState(0, (this.amplitude * Math.PI) / 180, this.mix);
    this.trajectory = [[...state]];
    for (let i = 1; i <= 4800; i++) {
      state = pendulumStep(state, DEFAULT_PENDULUM, 1 / 240);
      if (i % 8 === 0) this.trajectory.push([...state]);
    }
    const path = (bob: number) =>
      Array.from({ length: 601 }, (_, i) => {
        const state = normalModeState(
          i / 30,
          (this.amplitude * Math.PI) / 180,
          this.mix,
        );
        return `${i ? 'L' : 'M'}${(45 + (510 * i) / 600).toFixed(2)},${(115 - (state[bob] / (((this.amplitude * Math.PI) / 180) * Math.SQRT2)) * 75).toFixed(2)}`;
      }).join(' ');
    this.angle1Path = path(0);
    this.angle2Path = path(1);
  }
  preset(mix: number) {
    this.mix = mix;
    this.time = 0;
    this.rebuild();
  }
}
