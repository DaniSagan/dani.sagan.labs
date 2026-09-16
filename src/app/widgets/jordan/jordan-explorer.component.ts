import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { classifyJordanPoint, jordanPath, jordanPolygon, JordanPoint } from '../../shared/math/jordan-curve';

@Component({
  selector:'app-jordan-explorer', standalone:true, imports:[CommonModule, FormsModule],
  templateUrl:'./jordan-explorer.component.html', styleUrl:'./jordan-explorer.component.css'
})
export class JordanExplorerComponent implements OnDestroy {
  @ViewChild('drawing') drawing!: ElementRef<SVGSVGElement>;
  kind = 'flower'; amplitude = 0.35;
  point: JordanPoint = {x:370,y:240};
  polygon = jordanPolygon(this.kind, this.amplitude);
  path = jordanPath(this.polygon);
  result = classifyJordanPoint(this.point, this.polygon, 0.8);
  ray = true; playing = false;
  private dragging = false;
  private frame = 0;
  private last = 0;
  private phase = 0;
  get label(): string { return this.result.location === 'boundary' ? 'Sobre la curva' : this.result.location === 'inside' ? 'Interior' : 'Exterior'; }
  preset(kind: string): void { this.stop(); this.kind = kind; this.point = {x:370,y:240}; this.reshape(); }
  reshape(): void { this.polygon = jordanPolygon(this.kind, this.amplitude); this.path = jordanPath(this.polygon); this.refresh(); }
  refresh(): void { this.result = classifyJordanPoint(this.point, this.polygon, 0.8); }
  manual(): void { this.stop(); this.refresh(); }
  pointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.stop(); this.dragging = true;
    this.drawing.nativeElement.setPointerCapture(event.pointerId);
    this.movePoint(event);
  }
  pointerMove(event: PointerEvent): void { if (this.dragging) this.movePoint(event); }
  pointerUp(): void { this.dragging = false; }
  private movePoint(event: PointerEvent): void {
    const svg = this.drawing.nativeElement, matrix = svg.getScreenCTM();
    if (!matrix) return;
    const p = svg.createSVGPoint(); p.x = event.clientX; p.y = event.clientY;
    const q = p.matrixTransform(matrix.inverse());
    this.point = {x:Math.max(20,Math.min(720,q.x)),y:Math.max(25,Math.min(455,q.y))}; this.refresh();
  }
  moveKeyboard(event: KeyboardEvent): void {
    const directions: Record<string,[number,number]> = {ArrowLeft:[-5,0],ArrowRight:[5,0],ArrowUp:[0,-5],ArrowDown:[0,5]};
    const direction = directions[event.key]; if (!direction) return;
    event.preventDefault(); this.stop();
    this.point = {x:Math.max(20,Math.min(720,this.point.x+direction[0])),y:Math.max(25,Math.min(455,this.point.y+direction[1]))}; this.refresh();
  }
  onBoundary(): void { this.stop(); this.point = {...this.polygon[0]}; this.refresh(); }
  animate(): void {
    if (this.playing) { this.stop(); return; }
    this.playing = true; this.last = 0;
    this.phase = Math.acos(Math.max(-1, Math.min(1, (370 - this.point.x) / 340)));
    const tick = (time: number) => {
      if (!this.playing) return;
      const dt = this.last ? Math.min((time-this.last)/1000,0.05) : 0; this.last=time;
      if (!document.hidden) { this.phase += dt * 0.48; this.point = {...this.point,x:370-340*Math.cos(this.phase)}; this.refresh(); }
      this.frame=requestAnimationFrame(tick);
    };
    this.frame=requestAnimationFrame(tick);
  }
  stop(): void { cancelAnimationFrame(this.frame); this.frame=0; this.playing=false; }
  ngOnDestroy(): void { this.stop(); }
}
