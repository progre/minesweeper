import Coord = require('./../valueobject/coord');

export = MineWorld;
class MineWorld extends EventEmitter2 {
    player: { [key: number]: any };

    constructor() {
        super();
    }

    update() {
    }

    movePlayer(key: number, coord: Coord) {
        this.player[key];
    }
}
