import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Move2DComponent } from "../../../widgets/move2d/move2d.component";
import { Vec2 } from 'src/app/shared/math/vec2';
import { ZoomComponent } from "../../../widgets/zoom/zoom.component";

@Component({
  selector: 'app-bifurcation-diagram',
  standalone: true,
  imports: [FormsModule, Move2DComponent, ZoomComponent],
  templateUrl: './bifurcation-diagram.component.html',
  styleUrl: './bifurcation-diagram.component.css'
})
export class BifurcationDiagramComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  static title: string = 'Aplicación logística';
  static route: string = 'bifurcation-diagram';

  rMin: number = 2.5;
  rMax: number = 4.0;
  yMin: number = 0.0;
  yMax: number = 1.0;
  maxIterations: number = 1000;

  width = 800;
  height = 600;

  ngAfterViewInit() {
    this.drawBifurcationDiagram();
  }

  drawBifurcationDiagram() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.height);

    const lastIterations = 100;

    const xStart = 0.5;

    const rStep = (this.rMax - this.rMin) / this.width;
    const yScale = this.height / (this.yMax - this.yMin);

    ctx.fillStyle = 'red';

    for (let px = 0; px < this.width; px++) {
      const r = this.rMin + px * rStep;
      let x = xStart;

      for (let i = 0; i < this.maxIterations; i++) {
        x = r * x * (1 - x);

        if (i >= this.maxIterations - lastIterations) {
          const py = this.height - Math.floor((x - this.yMin) * yScale);
          ctx.fillRect(px, py, 1, 1);
        }
      }
    }
  }

  update() {
    this.drawBifurcationDiagram();
  }

  onMovement(value: Vec2) {
    if(value.x === 1) this.moveRight();
    if(value.x === -1) this.moveLeft();
    if(value.y === 1) this.moveUp();
    if(value.y === -1) this.moveDown();
  }

  moveRight() {
    let rSpan = this.rMax - this.rMin;
    this.rMin += rSpan / 2;
    this.rMax += rSpan / 2;
    this.update();
  }

  moveLeft() {
    let rSpan = this.rMax - this.rMin;
    this.rMin -= rSpan / 2;
    this.rMax -= rSpan / 2;
    this.update();
  }

  moveUp() {
    let ySpan = this.yMax - this.yMin;
    this.yMin += ySpan / 2;
    this.yMax += ySpan / 2;
    this.update();
  }

  moveDown() {
    let ySpan = this.yMax - this.yMin;
    this.yMin -= ySpan / 2;
    this.yMax -= ySpan / 2;
    this.update();
  }

  onZoom(value: number) {
    if(value === 1) this.zoomIn();
    if(value === -1) this.zoomOut();
  }

  zoomIn() {
    let rSpan = this.rMax - this.rMin;
    this.rMin += rSpan / 4;
    this.rMax -= rSpan / 4;
    let ySpan = this.yMax - this.yMin;
    this.yMin += ySpan / 4;
    this.yMax -= ySpan / 4;
    this.update();
  }

  zoomOut() {
    let rSpan = this.rMax - this.rMin;
    this.rMin -= rSpan / 4;
    this.rMax += rSpan / 4;
    let ySpan = this.yMax - this.yMin;
    this.yMin -= ySpan / 4;
    this.yMax += ySpan / 4;
    this.update();
  }

  onZoomReset(): void {
    this.rMin = 2.5;
    this.rMax = 4.0;
    this.yMin = 0.0;
    this.yMax = 1.0;
    this.update();
  }
}
