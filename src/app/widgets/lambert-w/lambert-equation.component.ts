import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { decayRoots } from '../../shared/math/lambert-w';

@Component({
  selector: 'app-lambert-equation', standalone: true, imports: [CommonModule, FormsModule],
  styleUrl: './lambert-w-widgets.css',
  template: `
    <section class="widget" aria-labelledby="lambert-equation-title">
      <h3 id="lambert-equation-title">Resolver x·e⁻ˣ = c</h3>
      <label for="lambert-c">c = {{ c | number:'1.3-6' }}</label>
      <input id="lambert-c" type="range" min="-0.2" max="0.5" step="0.001" [(ngModel)]="c" (ngModelChange)="update()">
      <div class="controls"><button type="button" (click)="set(0)">c = 0</button><button type="button" (click)="set(0.2)">c = 0,2</button><button type="button" (click)="set(1 / e)">c = 1/e</button><button type="button" (click)="set(0.45)">c = 0,45</button></div>
      <svg viewBox="0 0 700 340" role="img" aria-label="Intersecciones de la curva x por exponencial de menos x con la recta horizontal c">
        <line x1="60" [attr.y1]="y(0)" x2="640" [attr.y2]="y(0)" class="axis"/>
        <line [attr.x1]="x(0)" y1="30" [attr.x2]="x(0)" y2="290" class="axis"/>
        <path [attr.d]="path" class="curve"/>
        <line x1="60" [attr.y1]="y(c)" x2="640" [attr.y2]="y(c)" class="level"/>
        <g *ngFor="let t of [0,1,2,3,4,5,6]"><text [attr.x]="x(t)" y="317">{{ t }}</text></g>
        <g *ngFor="let t of [-0.2,0,0.2,0.4]"><text x="10" [attr.y]="y(t)">{{ t }}</text></g>
        <ng-container *ngFor="let root of roots"><circle *ngIf="root >= -0.2 && root <= 6" [attr.cx]="x(root)" [attr.cy]="y(c)" r="5" class="marker"/></ng-container>
        <text x="650" y="317">x</text><text x="550" [attr.y]="y(c)-8">y = c</text>
      </svg>
      <div aria-live="polite"><p>{{ roots.length }} soluciones reales.</p>
        <p *ngFor="let root of roots">x ≈ {{ root.toPrecision(10) }}; x·e⁻ˣ ≈ {{ check(root).toPrecision(10) }}
          <span *ngIf="root > 6 || root < -0.2">(fuera de la ventana gráfica)</span></p></div>
      <p class="note">El máximo de x·e⁻ˣ es 1/e en x = 1. Para 0 &lt; c &lt; 1/e, cada rama real de W proporciona una solución distinta.</p>
    </section>`
})
export class LambertEquationComponent {
  c = 0.2; readonly e = Math.E; roots: number[] = []; path = '';
  constructor() {
    this.path = Array.from({ length: 601 }, (_, i) => {
      const x = -0.2 + 6.2 * i / 600;
      return `${i ? 'L' : 'M'}${this.x(x)},${this.y(this.check(x))}`;
    }).join(' '); this.update();
  }
  x(x: number): number { return 60 + (x + 0.2) * 580 / 6.2; }
  y(y: number): number { return 290 - (y + 0.25) * 260 / 0.8; }
  check(x: number): number { return x * Math.exp(-x); }
  set(c: number): void { this.c = c; this.update(); }
  update(): void { this.roots = decayRoots(this.c); }
}
