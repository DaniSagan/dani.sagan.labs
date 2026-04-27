import { Vector2 } from "./vector2";

export class PolygonGenerator {
  static getVertices(sides: number, radius: number) : Vector2[] {
    const angle = 2 * Math.PI / sides;
    const initialAngle = angle / 2;
    let vertices = [];
    for(let k: number = 0; k < sides; k++) {
      const angleK = initialAngle + angle * k;
      vertices.push(new Vector2(radius * Math.sin(angleK), radius * Math.cos(angleK)));
    }
    return vertices;
  }
}
