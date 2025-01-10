export class Complex {
  real: number;
  imaginary: number;

  constructor(real: number, imaginary: number) {
    this.real = real;
    this.imaginary = imaginary;
  }

  absSquared() {
    return this.real * this.real + this.imaginary * this.imaginary;
  }

  abs() {
    return Math.sqrt(this.absSquared());
  }

  static sum(c1: Complex, c2: Complex): Complex {
    return new Complex(c1.real + c2.real, c1.imaginary + c2.imaginary);
  }

  static square(c: Complex): Complex {
    return new Complex(c.real * c.real - c.imaginary * c.imaginary, 2 * c.real * c.imaginary);
  }

  static multiply(c1: Complex, c2: Complex): Complex {
    return new Complex(c1.real*c2.real - c1.imaginary*c2.imaginary, c1.real*c2.imaginary + c1.imaginary*c2.real);
  }
}
