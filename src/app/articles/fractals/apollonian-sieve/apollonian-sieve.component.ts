import { RouterLink } from '@angular/router';
﻿import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Circle { x: number; y: number; r: number; }
@Component({ host: { class: 'fractal-page' }, selector: 'app-apollonian-sieve',
  templateUrl: './apollonian-sieve.component.html', styleUrls: ['./apollonian-sieve.component.css'],
  standalone: true, imports: [RouterLink, FormsModule] })
export class ApollonianSieveComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  static title = 'Tamiz de Apolonio'; static route = 'apollonian-sieve';
  width = 800; height = 800;
  maxDepth = 5; radius1 = 200; radius2 = 150; radius3 = 100;
  ngAfterViewInit(): void { this.update(); }
  update(): void {
    const bound = (n: number, min: number, max: number, fallback: number) => Number.isFinite(Number(n)) ? Math.max(min, Math.min(max, Number(n))) : fallback;
    this.maxDepth = Math.round(bound(this.maxDepth, 0, 7, 5));
    this.radius1 = bound(this.radius1, 80, 250, 200);
    this.radius2 = bound(this.radius2, 80, 250, 150);
    this.radius3 = bound(this.radius3, 80, 250, 100);
    this.drawApollonianSieve();
  }
  drawApollonianSieve(): void {
    const ctx = this.canvas.nativeElement.getContext('2d'); if (!ctx) return;
    ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, this.width, this.height);
    const a = this.radius1, b = this.radius2, c = this.radius3, d = a + b;
    const x = ((a+c)**2 + d*d - (b+c)**2) / (2*d);
    const circles: Circle[] = [{x:0,y:0,r:a},{x:d,y:0,r:b},{x,y:Math.sqrt((a+c)**2-x*x),r:c}];
    // Complex Descartes equation gives the enclosing circle with signed curvature.
    const outer = this.descartes(circles, -1); circles.push(outer);
    const scale = (this.width - 48) / (2 * Math.abs(outer.r));
    ctx.save(); ctx.translate(this.width/2, this.height/2); ctx.scale(scale, scale); ctx.translate(-outer.x, -outer.y);
    ctx.lineWidth = 1.3 / scale;
    ctx.strokeStyle = '#d4a843';
    circles.forEach(circle => this.drawCircle(ctx, circle.x, circle.y, Math.abs(circle.r)));
    const seen = new Set<string>();
    const visit = (quad: Circle[], depth: number, previous: number): void => {
      if (depth <= 0) return;
      for (let i = 0; i < 4; i++) {
        if (i === previous) continue;
        const other = quad.filter((_, j) => j !== i), old = quad[i];
        const k = 2 * other.reduce((sum,q)=>sum+1/q.r,0) - 1/old.r;
        if (k <= 0) continue;
        const next: Circle = { r:1/k,
          x:(2*other.reduce((sum,q)=>sum+q.x/q.r,0)-old.x/old.r)/k,
          y:(2*other.reduce((sum,q)=>sum+q.y/q.r,0)-old.y/old.r)/k };
        if (next.r * scale < .45) continue;
        const key = `${next.x.toFixed(5)},${next.y.toFixed(5)},${next.r.toFixed(5)}`;
        if (seen.has(key)) continue; seen.add(key);
        ctx.strokeStyle = depth % 2 ? '#d4a843' : '#e8643a';
        this.drawCircle(ctx, next.x, next.y, next.r);
        const copy = [...quad]; copy[i] = next; visit(copy, depth - 1, i);
      }
    };
    visit(circles, this.maxDepth, -1); ctx.restore();
  }
  drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2*Math.PI); ctx.stroke();
  }
  calculateInnerCircle(a: Circle, b: Circle, c: Circle): Circle { return this.descartes([a,b,c], 1); }
  private descartes(circles: Circle[], sign: number): Circle {
    const k = circles.map(c => 1/c.r);
    const curvature = k[0]+k[1]+k[2]+sign*2*Math.sqrt(k[0]*k[1]+k[1]*k[2]+k[2]*k[0]);
    let re = 0, im = 0;
    for (const [i,j] of [[0,1],[1,2],[2,0]]) {
      re += k[i]*k[j]*(circles[i].x*circles[j].x-circles[i].y*circles[j].y);
      im += k[i]*k[j]*(circles[i].x*circles[j].y+circles[i].y*circles[j].x);
    }
    const m = Math.hypot(re, im), sr = Math.sqrt((m+re)/2), si = (im < 0 ? -1 : 1)*Math.sqrt((m-re)/2);
    const rx = circles.reduce((sum,c,i)=>sum+k[i]*c.x,0), ry = circles.reduce((sum,c,i)=>sum+k[i]*c.y,0);
    const candidates = [1,-1].map(s => ({x:(rx+s*2*sr)/curvature, y:(ry+s*2*si)/curvature,r:1/curvature}));
    const error = (q: Circle) => circles.reduce((sum,c)=>sum+Math.abs(Math.hypot(q.x-c.x,q.y-c.y)-Math.abs(q.r+c.r)),0);
    return candidates.sort((a,b)=>error(a)-error(b))[0];
  }
}
