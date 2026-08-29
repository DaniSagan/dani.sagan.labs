import { Line } from "src/app/mathematics/geometry/line";
import { Vec2 } from 'src/app/shared/math/vec2';
import { CanvasItem } from "./canvas-item";

export class LineItem extends CanvasItem {
  public line: Line;
  public width: number = 1;
  public strokeStyle: string | null = null;

  constructor(p1: Vec2, p2: Vec2) {
    super();
    this.line = new Line(p1, p2);
  }

  override draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.lineWidth = this.width;
    if(this.strokeStyle) {
      context.strokeStyle = this.strokeStyle;
    }
    context.moveTo(this.line.p1.x, this.line.p1.y);
    context.lineTo(this.line.p2.x, this.line.p2.y);
    context.stroke();
    context.closePath();
  }
}
