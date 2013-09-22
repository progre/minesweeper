declare module 'biginteger' {
    class BigInteger {
        static ZERO: BigInteger;
        static ONE: BigInteger;
        static M_ONE: BigInteger;
        static _0: BigInteger;
        static _1: BigInteger;
        static small: any;
        static parse(s: string, base: number);

        constructor();
        constructor(n: number);
        constructor(n: string);
        constructor(n: BigInteger);

        toString: Function;
        parse: Function;
        add: Function;
        negate: Function;
        abs: Function;
        subtract: Function;
        next: Function;
        prev: Function;
        compareAbs: Function;
        compare: Function;
        isUnit: Function;
        multiply: Function;
        square: Function;
        divide: Function;
        remainder: Function;
        divRem: Function;
        isEven: Function;
        isOdd: Function;
        sign: Function;
        isPositive: Function;
        isNegative: Function;
        isZero: Function;
        exp10: Function;
        pow: Function;
        modPow: Function;
        valueOf: Function;
        toJSValue: () => number;

        MAX_EXP: any;
    }
}