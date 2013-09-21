export = Coord;
class Coord {
    static of(x: string, y: string) {
        return new Coord(new BigInteger(x), new BigInteger(y));
    }

    /** @private */
    constructor(
        private x: BigInteger,
        private y: BigInteger) {
    }

    subtract(target: Coord) {
        return new Coord(this.x.subtract(target.x), this.y.subtract(target.y));
    }
}
