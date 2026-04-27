import { Component, ElementRef, ViewChild } from '@angular/core';
import { PolygonGenerator } from 'src/app/mathematics/geometry/polygon-generator';
import { Vector2 } from 'src/app/mathematics/geometry/vector2';

@Component({
  selector: 'app-triangle-article',
  standalone: true,
  imports: [],
  templateUrl: './triangle-article.component.html',
  styleUrl: './triangle-article.component.css'
})
export class TriangleArticleComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  static title: string = 'Triángulo';
  static route: string = 'triangle';

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.draw();
  }

  draw(): void {
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    const center = new Vector2(canvasWidth / 2, canvasHeight / 2);

    let sides = 3;
    let vertices = PolygonGenerator.getVertices(sides, canvasWidth / 2 - 50);

    // sides
    this.ctx.lineWidth = 2;
    for(let k: number = 0; k < sides; k++) {
      this.ctx.beginPath();
      this.ctx.moveTo(center.x + vertices[k % sides].x, center.y + vertices[k % sides].y);
      this.ctx.lineTo(center.x + vertices[(k+1) % sides].x, center.y + vertices[(k+1) % sides].y);
      this.ctx.stroke();
    }
  }
}
