declare module 'jsbn' {
    export = BigInteger;
    class BigInteger {
        static ZERO: BigInteger;
        static ONE: BigInteger;
        constructor(val: string, radix?: number);
        toString: Function;
        negate: Function;
        abs: Function;
        compareTo: Function;
        bitLength: Function;
        mod: Function;
        modPowInt: Function;
        clone: Function;
        intValue: Function;
        byteValue: Function;
        shortValue: Function;
        signum: Function;
        toByteArray: Function;
        equals: Function;
        min: Function;
        max: Function;
        and: Function;
        or: Function;
        xor: Function;
        andNot: Function;
        not: Function;
        shiftLeft: Function;
        shiftRight: Function;
        getLowestSetBit: Function;
        bitCount: Function;
        testBit: Function;
        setBit: Function;
        clearBit: Function;
        flipBit: Function;
        add: Function;
        subtract: Function;
        multiply: Function;
        divide: Function;
        remainder: Function;
        divideAndRemainder: Function;
        modPow: Function;
        modInverse: Function;
        pow: Function;
        gcd: Function;
        isProbablePrime: Function;
        square: Function;
    }
}