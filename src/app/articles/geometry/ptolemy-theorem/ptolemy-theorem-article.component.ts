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
