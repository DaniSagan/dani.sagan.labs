/// <reference types="jasmine" />

import { Vec2 } from './vec2';

describe('Vec2', () => {
  it('should create a vector with the provided coordinates', () => {
    const v = new Vec2(3, 4);

    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  it('should add two vectors', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);

    const result = a.add(b);

    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('should sum a vector using the alias', () => {
    const a = new Vec2(5, 1);
    const b = new Vec2(2, 3);

    const result = a.sum(b);

    expect(result.x).toBe(7);
    expect(result.y).toBe(4);
  });

  it('should subtract two vectors', () => {
    const a = new Vec2(7, 9);
    const b = new Vec2(2, 3);

    const result = a.subtract(b);

    expect(result.x).toBe(5);
    expect(result.y).toBe(6);
  });

  it('should subtract using the alias', () => {
    const a = new Vec2(10, 8);
    const b = new Vec2(4, 2);

    const result = a.difference(b);

    expect(result.x).toBe(6);
    expect(result.y).toBe(6);
  });

  it('should compute the length of a vector', () => {
    const v = new Vec2(3, 4);

    expect(v.getLength()).toBe(5);
  });

  it('should compute the angle of a vector', () => {
    const v = new Vec2(1, 0);
    expect(v.getAngle()).toBeCloseTo(0, 10);

    const v2 = new Vec2(0, 1);
    expect(v2.getAngle()).toBeCloseTo(Math.PI / 2, 10);

    const v3 = new Vec2(-1, 0);
    expect(v3.getAngle()).toBeCloseTo(Math.PI, 10);
  });

  it('should return the unit vector for a non-zero vector', () => {
    const v = new Vec2(3, 4);
    const unit = v.getUnit();

    expect(unit.x).toBeCloseTo(0.6, 10);
    expect(unit.y).toBeCloseTo(0.8, 10);
    expect(unit.getLength()).toBeCloseTo(1, 10);
  });

  it('should return the zero vector for a zero vector unit conversion', () => {
    const v = new Vec2(0, 0);
    const unit = v.getUnit();

    expect(unit.x).toBe(0);
    expect(unit.y).toBe(0);
  });

  it('should compute the dot product', () => {
    const a = new Vec2(1, 2);
    const b = new Vec2(3, 4);

    expect(a.dot(b)).toBe(11);
  });

  it('should scale a vector by a scalar', () => {
    const v = new Vec2(2, 3);
    const result = v.scale(4);

    expect(result.x).toBe(8);
    expect(result.y).toBe(12);
  });

  it('should scale by zero and return the zero vector', () => {
    const v = new Vec2(5, -2);
    const result = v.scale(0);

    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  it('should compute the 2D cross product as a signed scalar', () => {
    const a = new Vec2(1, 0);
    const b = new Vec2(0, 1);
    const c = new Vec2(0, -1);

    expect(a.cross(b)).toBe(1);
    expect(a.cross(c)).toBe(-1);
    expect(a.cross(new Vec2(2, 0))).toBe(0);
  });

  it('should support chaining operations', () => {
    const v = new Vec2(1, 2)
      .add(new Vec2(2, 3))
      .scale(2)
      .subtract(new Vec2(1, 1));

    expect(v.x).toBe(5);
    expect(v.y).toBe(9);
  });
});
