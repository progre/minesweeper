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
        and(val: BigInteger): BigInteger;
        or(val: BigInteger): BigInteger;
        xor(val: BigInteger): BigInteger;
        andNot(val: BigInteger): BigInteger;
        not(val: BigInteger): BigInteger;
        shiftLeft(n: number): BigInteger;
        shiftRight(n: number): BigInteger;
        getLowestSetBit: Function;
        bitCount: Function;
        testBit: Function;
        setBit: Function;
        clearBit: Function;
        flipBit: Function;
        add(val: BigInteger): BigInteger;
        subtract(val: BigInteger): BigInteger;
        multiply(val: BigInteger): BigInteger;
        divide(val: BigInteger): BigInteger;
        remainder(val: BigInteger): BigInteger;
        divideAndRemainder(val: BigInteger): BigInteger;
        modPow: Function;
        modInverse: Function;
        pow(exponent: number): BigInteger;
        gcd: Function;
        isProbablePrime: Function;
        square: Function;
    }
}