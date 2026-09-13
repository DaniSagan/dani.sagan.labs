import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { GEOMETRY_SCENES } from './geometry-scenes';

export interface GeometryScene {
  points: {
    x: number;
    y: number;
    label?: string;
    color?: string;
    dx?: number;
    dy?: number;
    marker?: boolean;
  }[];
  paths: {
    points: number[][];
    color?: string;
    dashed?: boolean;
    closed?: boolean;
    fill?: string;
  }[];
  circles: {
    x: number;
    y: number;
    r: number;
    color?: string;
    dashed?: boolean;
  }[];
}

@Component({
  selector: 'app-geometry-diagram',
  standalone: true,
  template: `<figure>
    <canvas
      #canvas
      width="1200"
      height="840"
      role="img"
      [attr.aria-label]="description"
      >{{ description }}</canvas
    >
    <figcaption>{{ description }}</figcaption>
  </figure>`,
  styles: [
    `
      :host {
        display: block;
      }
      figure {
        margin: 1.5rem 0;
      }
      canvas {
        display: block;
        width: 100%;
        max-width: 720px;
        height: auto;
        margin: auto;
        background: var(--paper);
        border: 1px solid var(--rule);
        border-radius: 12px;
      }
      figcaption {
        margin: 0.7rem auto 0;
        max-width: 720px;
        color: var(--ink);
        font-size: 0.9rem;
        line-height: 1.5;
      }
    `,
  ],
})
export class GeometryDiagramComponent implements AfterViewInit {
  @Input({ required: true }) diagram!: string;
  @Input({ required: true }) description!: string;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const scene: GeometryScene | undefined = GEOMETRY_SCENES[this.diagram];
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx || !scene) return;
    const all = [
      ...scene.points,
      ...scene.paths.flatMap((p) => p.points.map(([x, y]) => ({ x, y }))),
      ...scene.circles.flatMap((c) => [
        { x: c.x - c.r, y: c.y - c.r },
        { x: c.x + c.r, y: c.y + c.r },
      ]),
    ];
    const minX = Math.min(...all.map((p) => p.x)),
      maxX = Math.max(...all.map((p) => p.x));
    const minY = Math.min(...all.map((p) => p.y)),
      maxY = Math.max(...all.map((p) => p.y));
    const scale = Math.min(480 / (maxX - minX || 1), 300 / (maxY - minY || 1));
    const x = (v: number) => 300 + (v - (minX + maxX) / 2) * scale;
    const y = (v: number) => 210 - (v - (minY + maxY) / 2) * scale;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 600, 420);
    ctx.lineWidth = 1.6;
    for (const c of scene.circles) {
      ctx.beginPath();
      ctx.setLineDash(c.dashed ? [5, 5] : []);
      ctx.strokeStyle = c.color || '#9bd4ff';
      ctx.arc(x(c.x), y(c.y), c.r * scale, 0, 2 * Math.PI);
      ctx.stroke();
    }
    for (const path of scene.paths) {
      if (!path.points.length) continue;
      ctx.beginPath();
      ctx.setLineDash(path.dashed ? [5, 5] : []);
      ctx.strokeStyle = path.color || '#e8c777';
      path.points.forEach(([px, py], i) =>
        i ? ctx.lineTo(x(px), y(py)) : ctx.moveTo(x(px), y(py)),
      );
      if (path.closed) ctx.closePath();
      if (path.fill) {
        ctx.fillStyle = path.fill;
        ctx.fill();
      }
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const point of scene.points) {
      ctx.fillStyle = point.color || '#e8e4d8';
      if (point.marker !== false) {
        ctx.beginPath();
        ctx.arc(x(point.x), y(point.y), point.label ? 3 : 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      if (point.label) {
        ctx.font = '16px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#12121e';
        const px = x(point.x) + (point.dx || 0),
          py = y(point.y) + (point.dy ?? -11);
        ctx.strokeText(point.label, px, py);
        ctx.fillText(point.label, px, py);
      }
    }
  }
}
