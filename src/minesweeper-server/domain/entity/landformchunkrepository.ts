import Tile = require('./../../../minesweeper-common/domain/valueobject/tile');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');

export = LandformChunkRepository;
class LandformChunkRepository {
    constructor() {
        // DBに接続
    }

    /** ない場合はnullを返す */
    get(coord: Coord, callback: (chunk: Chunk<Tile>) => void): void {
        callback(null);
    }

    put(coord: Coord, chunk: Chunk<Tile>) {
    }

    putShred(coord: Coord, tile: Tile) {
    }
}
