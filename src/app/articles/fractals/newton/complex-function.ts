import { Complex } from "src/app/shared/math/complex";

export class ComplexFunction {
  fn: (z: Complex) => Complex;
  derivative: (z: Complex) => Complex;
  roots: Complex[];

  constructor(fn: (z: Complex) => Complex, derivative: (z: Complex) => Complex, roots: Complex[]) {
    this.fn = fn;
    this.derivative = derivative;
    this.roots = roots;
  }
}
