import { diff, mult, sum, Vector2 } from "./vector2";

export class Line {
  public p1: Vector2;
  public p2: Vector2;

  constructor(p1: Vector2, p2: Vector2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  get direction(): Vector2 {
    return diff(this.p2, this.p1);
  }

  get length(): number {
    return this.direction.length;
  }

  getPointAt(proportion: number): Vector2 {
    return sum(this.p1, mult(this.direction, proportion));
  }

  getRotated(angle: number, origin: Vector2): Line {
    let newP1 = sum(diff(this.p1, origin).rotate(angle), origin);
    let newP2 = sum(diff(this.p2, origin).rotate(angle), origin);
    return new Line(newP1, newP2);
  }
}
