import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');

export = Map;
class Map {
    // 地雷（地形）Map 普通の爆弾、☢、Bakuhigashi等
    // 解放状況(close, flag, open)

    getLandform(coord: Coord) {
    }

    getNumber(coord: Coord) {
    }

    getCover(coord: Coord) {
    }
}

class Chunk<T> {
    private cache: { [key: string]: T } = {};
    get(coord: Coord) {
    }
}
