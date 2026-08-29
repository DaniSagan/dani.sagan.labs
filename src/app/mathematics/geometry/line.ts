import { Vec2 } from 'src/app/shared/math/vec2';

export class Line {
  public p1: Vec2;
  public p2: Vec2;

  constructor(p1: Vec2, p2: Vec2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  get direction(): Vec2 {
    return this.p2.subtract(this.p1);
  }

  get length(): number {
    return this.direction.getLength();
  }

  getPointAt(proportion: number): Vec2 {
    return this.p1.add(this.direction.scale(proportion));
  }

  getRotated(angle: number, origin: Vec2): Line {
    const newP1 = this.p1.subtract(origin).rotate(angle).add(origin);
    const newP2 = this.p2.subtract(origin).rotate(angle).add(origin);
    return new Line(newP1, newP2);
  }
}
