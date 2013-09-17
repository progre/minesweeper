declare class BigInteger {
    constructor(a: string);
    constructor(a: number, b: number, c: number);
    toString(radix:number): string;
    negate: Function;
    abs: Function;
    compareTo: Function;
    bitLength: Function;
    mod: Function;
    modPowInt: Function;
}

export = Coord;
class Coord {
    private x: BigInteger;
    private y: BigInteger;
}
