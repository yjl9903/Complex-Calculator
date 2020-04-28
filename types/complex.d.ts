export declare class Complex {
    real: number;
    imag: number;
    constructor(real: number, imag: number);
    toString(): string;
    abs(): Complex;
    norm(): Complex;
    conj(): Complex;
    arg(): Complex;
    static add(a: Complex, b: Complex): Complex;
    static sub(a: Complex, b: Complex): Complex;
    static mul(a: Complex, b: Complex): Complex;
    static div(a: Complex, b: Complex): Complex;
}
