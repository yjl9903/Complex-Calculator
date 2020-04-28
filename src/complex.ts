export class Complex {
  real: number;
  imag: number;

  constructor(real: number, imag: number) {
    this.real = real;
    this.imag = imag;
  }

  toString() {
    if (this.real === 0 && this.imag === 0) {
      return '0';
    } else if (this.real === 0) {
      return this.imag + 'i';
    } else if (this.imag === 0) {
      return String(this.real);
    } else {
      return `${this.real} + ${this.imag}i`;
    }
  }

  abs() {
    return new Complex(Math.hypot(this.real, this.imag), 0);
  }

  norm() {
    return new Complex(this.real * this.real + this.imag * this.imag, 0);
  }

  conj() {
    return new Complex(this.real, -this.imag);
  }

  arg() {
    return new Complex(Math.atan2(this.imag, this.real), 0);
  }

  static add(a: Complex, b: Complex) {
    return new Complex(a.real + b.real, a.imag + b.imag);
  }

  static sub(a: Complex, b: Complex) {
    return new Complex(a.real - b.real, a.imag - b.imag);
  }

  static mul(a: Complex, b: Complex) {
    return new Complex(
      a.real * b.real - a.imag * b.imag,
      a.real * b.imag + a.imag * b.real
    );
  }

  static div(a: Complex, b: Complex) {
    const r = Complex.mul(a, b.conj());
    const norm = b.real * b.real + b.imag * b.imag;
    return new Complex(r.real / norm, r.imag / norm);
  }
}
