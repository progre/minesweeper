import BigInteger = require('jsbn');
import Tile = require('./../../../minesweeper-common/domain/valueobject/tile');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import database = require('./../../infrastructure/database');

export = LandformChunkRepository;
class LandformChunkRepository {
    constructor() {
        // DBÇ…ê⁄ë±
    }

    /** Ç»Ç¢èÍçáÇÕnullÇï‘Ç∑ */
    get(coord: Coord, callback: (chunk: Chunk<Tile>) => void): void {
        database.chunks.get(coord.toString(), rawChunk => {
            if (rawChunk == null) {
                callback(null);
                return;
            }
            var chunk = new Chunk(rawChunk.items.map(x =>
                x.map(x => new Tile(x.landform, x.status, x.layer))));
            callback(chunk);
        });
    }

    put(coord: Coord, chunk: Chunk<Tile>) {
        database.chunks.put(coord.toString(), chunk);
    }

    putShred(coord: Coord, tile: Tile) {
        var globalCoord = new Coord(coord.x.shiftRight(4), coord.y.shiftRight(4));
        this.get(globalCoord, (chunk: Chunk<Tile>) => {
            if (chunk == null)
                return;
            var y = coord.y.and(new BigInteger('15')).intValue();
            var x = coord.x.and(new BigInteger('15')).intValue();
            chunk.put(x, y, tile);
            this.put(globalCoord, chunk);
        });
    }
}
