import { Vec2 } from 'src/app/shared/math/vec2';

export class PolygonGenerator {
  static getVertices(sides: number, radius: number): Vec2[] {
    const angle = 2 * Math.PI / sides;
    const initialAngle = angle / 2;
    const vertices: Vec2[] = [];
    for (let k = 0; k < sides; k++) {
      const angleK = initialAngle + angle * k;
      vertices.push(new Vec2(radius * Math.sin(angleK), radius * Math.cos(angleK)));
    }
    return vertices;
  }
}
