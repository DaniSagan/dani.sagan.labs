export class Vec2 {
  x: number;
  y: number;

  /**
   * Creates a 2D vector.
   *
   * @param x The x component.
   * @param y The y component.
   */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns a new vector equal to the sum of this vector and another one.
   *
   * @param other The vector to add.
   * @returns The resulting vector.
   */
  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  /**
   * Alias for add.
   *
   * @param other The vector to add.
   * @returns The sum vector.
   */
  sum(other: Vec2): Vec2 {
    return this.add(other);
  }

  /**
   * Returns a new vector equal to the difference between this vector and another one.
   *
   * @param other The vector to subtract.
   * @returns The resulting vector.
   */
  subtract(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  /**
   * Alias for subtract.
   *
   * @param other The vector to subtract.
   * @returns The difference vector.
   */
  difference(other: Vec2): Vec2 {
    return this.subtract(other);
  }

  /**
   * Computes the vector length or magnitude.
   *
   * @returns The Euclidean norm of the vector.
   */
  getLength(): number {
    return Math.hypot(this.x, this.y);
  }

  /**
   * Computes the angle of the vector in radians relative to the positive x-axis.
   *
   * @returns The angle in radians.
   */
  getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Returns the unit vector pointing in the same direction as this vector.
   * If the vector is zero, it returns the zero vector.
   *
   * @returns A normalized vector.
   */
  getUnit(): Vec2 {
    const length = this.getLength();
    if (length === 0) {
      return new Vec2(0, 0);
    }
    return new Vec2(this.x / length, this.y / length);
  }

  /**
   * Computes the dot product between this vector and another vector.
   *
   * @param other The other vector.
   * @returns The scalar dot product.
   */
  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Returns a new vector multiplied by a scalar.
   *
   * @param scalar The scalar multiplier.
   * @returns The scaled vector.
   */
  scale(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  /**
   * Computes the 2D cross product as the scalar z-component of the 3D cross product.
   * A positive value means counter-clockwise orientation, and a negative value means clockwise orientation.
   *
   * @param other The other vector.
   * @returns The signed area determinant.
   */
  cross(other: Vec2): number {
    return this.x * other.y - this.y * other.x;
  }
}
