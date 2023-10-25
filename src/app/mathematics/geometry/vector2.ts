export class Vector2 {

  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get unit(): Vector2 {
    let length: number = this.length;
    return new Vector2(this.x / length, this.y / length);
  }

  rotate(angle: number) {
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    return new Vector2(c*this.x - s*this.y, s*this.x + c*this.y);
  }

  sum(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  mult(scale: number): Vector2 {
    return new Vector2(this.x * scale, this.y * scale);
  }
}

export function sum(v1: Vector2, v2: Vector2): Vector2 {
  return new Vector2(v1.x + v2.x, v1.y + v2.y);
}

export function diff(v1: Vector2, v2: Vector2): Vector2 {
  return new Vector2(v1.x - v2.x, v1.y - v2.y);
}
export function mult(v: Vector2, p: number): Vector2 {
  return new Vector2(v.x * p, v.y * p);
}
