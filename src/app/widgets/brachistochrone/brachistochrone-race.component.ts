import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cycloidPoint, positionAt, sampleTrack, solveCycloid, TrackPoint } from '../../shared/math/brachistochrone';

interface Track { name: string; color: string; dash: string; points: TrackPoint[]; path: string; time: number; length: number; }

@Component({
  selector: 'app-brachistochrone-race', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './brachistochrone-race.component.html', styleUrl: './brachistochrone-widgets.css'
})
export class BrachistochroneRaceComponent implements OnDestroy {
  distance = 6; depth = 3; gravity = 9.81; bend = 3; speed = 0.5;
  elapsed = 0; playing = false; tracks: Track[] = []; scale = 60;
  solution = solveCycloid(6, 3);
  private frame = 0;
  constructor() { this.update(); }
  get duration(): number { return Math.max(...this.tracks.map(t => t.time)); }
  get saving(): number { return 100 * (1 - this.solution.time / this.tracks[1].time); }
  sx(x: number): number { return 48 + x * this.scale; }
  sy(y: number): number { return 38 + y * this.scale; }
  update(): void {
    this.reset();
    this.solution = solveCycloid(this.distance, this.depth, this.gravity);
    const c = this.solution;
    const optimal = Array.from({ length: 601 }, (_, i) => ({ ...cycloidPoint(c.radius, c.theta * i / 600), t: c.time * i / 600 }));
    const straight = sampleTrack(u => ({ x: this.distance * u, y: this.depth * u }), this.gravity);
    const custom = sampleTrack(u => ({ x: this.distance * u, y: this.depth * u + 4 * this.bend * u * (1 - u) }), this.gravity);
    this.scale = Math.min(690 / this.distance, 290 / Math.max(...optimal.map(p => p.y), ...custom.map(p => p.y), this.depth));
    this.tracks = [
      this.track('Cicloide', '#82e3cc', '', optimal),
      this.track('Recta', '#f6cc80', '8 5', straight),
      this.track('Tu parábola', '#c5a6ff', '3 5', custom)
    ];
  }
  private track(name: string, color: string, dash: string, points: TrackPoint[]): Track {
    return { name, color, dash, points, path: points.map((p, i) => `${i ? 'L' : 'M'}${this.sx(p.x).toFixed(2)},${this.sy(p.y).toFixed(2)}`).join(' '),
      time: points[points.length - 1].t, length: points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0) };
  }
  ball(track: Track): TrackPoint {
    if (track === this.tracks[0]) return { ...cycloidPoint(this.solution.radius, Math.min(this.solution.theta, this.elapsed * Math.sqrt(this.gravity / this.solution.radius))), t: this.elapsed };
    return positionAt(track.points, this.elapsed);
  }
  velocity(track: Track): number { return Math.sqrt(2 * this.gravity * this.ball(track).y); }
  preset(distance: number, depth: number): void { this.distance = distance; this.depth = depth; this.update(); }
  seek(value: number): void { this.pause(); this.elapsed = +value; }
  toggle(): void {
    if (this.playing) { this.pause(); return; }
    if (this.elapsed >= this.duration) this.elapsed = 0;
    this.playing = true;
    let previous = performance.now();
    const tick = (now: number) => {
      this.elapsed = Math.min(this.duration, this.elapsed + Math.min((now - previous) / 1000, 0.1) * this.speed);
      previous = now;
      if (this.elapsed >= this.duration) this.playing = false;
      else this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }
  pause(): void { cancelAnimationFrame(this.frame); this.playing = false; }
  reset(): void { this.pause(); this.elapsed = 0; }
  ngOnDestroy(): void { this.pause(); }
}
