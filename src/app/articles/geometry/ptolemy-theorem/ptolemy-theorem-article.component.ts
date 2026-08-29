import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';

interface PtolemyPoint {
  label: string;
  angle: number;
}

@Component({
  selector: 'app-ptolemy-theorem-article',
  standalone: true,
  imports: [CommonModule, FormulaComponent],
  templateUrl: './ptolemy-theorem-article.component.html',
  styleUrl: './ptolemy-theorem-article.component.css'
})
export class PtolemyTheoremArticleComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('explanationCanvas', { static: true }) explanationCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private draggingIndex: number | null = null;

  static title: string = 'Teorema de Ptolomeo';
  static route: string = 'ptolemy-theorem';

  readonly radius = 150;
  readonly centerX = 240;
  readonly centerY = 220;

  points: PtolemyPoint[] = [
    { label: 'A', angle: 2.4 },
    { label: 'B', angle: 0.9 },
    { label: 'C', angle: 5.5 },
    { label: 'D', angle: 3.8 },
  ];

  ab = 0;
  bc = 0;
  cd = 0;
  da = 0;
  ac = 0;
  bd = 0;
  leftSide = 0;
  rightSide = 0;
  difference = 0;

  theoremFormula = '$$AC \cdot BD = AB \cdot CD + BC \cdot DA$$';

  ngOnInit(): void {
    this.updateMetrics();
  }

  ngAfterViewInit(): void {
    this.draw();
    this.drawExplanation();
  }

  private getPoint(index: number): { x: number; y: number } {
    const angle = this.points[index].angle;
    return {
      x: this.centerX + this.radius * Math.cos(angle),
      y: this.centerY + this.radius * Math.sin(angle)
    };
  }

  private distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.hypot(dx, dy);
  }

  updateMetrics(): void {
    const a = this.getPoint(0);
    const b = this.getPoint(1);
    const c = this.getPoint(2);
    const d = this.getPoint(3);

    this.ab = this.distance(a, b);
    this.bc = this.distance(b, c);
    this.cd = this.distance(c, d);
    this.da = this.distance(d, a);
    this.ac = this.distance(a, c);
    this.bd = this.distance(b, d);

    this.leftSide = this.ab * this.cd + this.bc * this.da;
    this.rightSide = this.ac * this.bd;
    this.difference = this.rightSide - this.leftSide;
  }

  draw(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    this.ctx = ctx;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = '#5fb3ff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    const points = this.points.map((point, index) => ({ ...point, ...this.getPoint(index) }));

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(points[1].x, points[1].y);
    this.ctx.lineTo(points[2].x, points[2].y);
    this.ctx.lineTo(points[3].x, points[3].y);
    this.ctx.closePath();
    this.ctx.strokeStyle = '#f5d76e';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    this.ctx.lineTo(points[2].x, points[2].y);
    this.ctx.moveTo(points[1].x, points[1].y);
    this.ctx.lineTo(points[3].x, points[3].y);
    this.ctx.strokeStyle = '#9bd4ff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    points.forEach((point) => {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#ffffff';
      this.ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.fillStyle = '#0b1020';
      this.ctx.font = 'bold 14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(point.label, point.x, point.y);
      this.ctx.fill();
    });
  }

  private drawExplanation(): void {
    const canvas = this.explanationCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 200;
    const angles = [2.2, 0.3, 5.0, 3.8];
    const labels = ['A', 'B', 'C', 'D'];
    const points = angles.map((angle, index) => ({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      label: labels[index],
      angle,
    }));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#5fb3ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.strokeStyle = '#f5d76e';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.moveTo(points[1].x, points[1].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.strokeStyle = '#9bd4ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    const arcStyle = '#ffcf70';
    const angleMarkers = [
      { start: 0.7, end: 2.2, cx, cy, r: 28, label: '∠ABC' },
      { start: 2.2, end: 3.8, cx, cy, r: 36, label: '∠BCD' },
      { start: 3.8, end: 5.4, cx, cy, r: 32, label: '∠CDA' },
      { start: 5.4, end: 6.28, cx, cy, r: 26, label: '∠DAB' }
    ];

    angleMarkers.forEach(({ start, end, cx, cy, r, label }) => {
      ctx.beginPath();
      ctx.strokeStyle = arcStyle;
      ctx.lineWidth = 2;
      ctx.arc(cx, cy, r, start, end);
      ctx.stroke();

      const mid = (start + end) / 2;
      const lx = cx + (r + 10) * Math.cos(mid);
      const ly = cy + (r + 10) * Math.sin(mid);
      ctx.fillStyle = '#d8ecff';
      ctx.font = '11px sans-serif';
      ctx.fillText(label, lx, ly);
    });

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px sans-serif';
    ctx.fillText('R', cx + radius / 2, cy - 8);

    points.forEach((point) => {
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#0b1020';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.label, point.x, point.y);
    });

    ctx.fillStyle = '#d8ecff';
    ctx.font = '12px sans-serif';
    ctx.fillText('AB', (points[0].x + points[1].x) / 2, (points[0].y + points[1].y) / 2 - 10);
    ctx.fillText('BC', (points[1].x + points[2].x) / 2 + 12, (points[1].y + points[2].y) / 2 + 12);
    ctx.fillText('CD', (points[2].x + points[3].x) / 2, (points[2].y + points[3].y) / 2 + 18);
    ctx.fillText('DA', (points[3].x + points[0].x) / 2 - 12, (points[3].y + points[0].y) / 2 - 12);
    ctx.fillText('AC', (points[0].x + points[2].x) / 2, (points[0].y + points[2].y) / 2 - 12);
    ctx.fillText('BD', (points[1].x + points[3].x) / 2, (points[1].y + points[3].y) / 2 + 12);
  }

  onPointerDown(event: PointerEvent): void {
    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hitIndex = this.points.findIndex((_, index) => {
      const point = this.getPoint(index);
      return Math.hypot(point.x - x, point.y - y) <= 16;
    });

    if (hitIndex >= 0) {
      this.draggingIndex = hitIndex;
      this.onPointerMove(event);
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (this.draggingIndex === null) {
      return;
    }

    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const angle = Math.atan2(y - this.centerY, x - this.centerX);

    this.points[this.draggingIndex].angle = angle;
    this.updateMetrics();
    this.draw();
  }

  onPointerUp(): void {
    this.draggingIndex = null;
  }
}
