var log4js = require('log4js');
import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import ChunkNotFoundError = require('./../../../minesweeper-common/domain/entity/chunknotfounderror');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import MultiMap = require('./multimap');
import Player = require('./player');

var logger = log4js.getLogger();

export = Landform;
class Landform extends MapBase {
    private players = new CoordMultiMap();

    join(coord: Coord, player: Player) {
        logger.debug('player join to: ' + coord.toString());
        this.players.put(coord, player);
        var chunk = this.getViewPointChunk(coord);
        if (chunk == null)
            return;
        player.putChunk(coord, chunk);
    }

    defect(coord: Coord, player: Player) {
        logger.debug('player defect from: ' + coord.toString());
        this.players.removeValueAll(player);
    }

    defectAll(player: Player) {
        logger.debug('player defect all.');
        this.players.removeValueAll(player);
    }

    /** override */
    /** @protected */
    requestViewPointChunk(coord: Coord) {
        // DBに取りに行ったり
        (callback => callback(null))((chunk: vp.ViewPoint[][]) => {
            if (chunk == null) {
                chunk = createViewPointChunk();
                if (coord.equals(Coord.fromNumber(-1, -1))) {
                    setEmpty(chunk, 13, 13, 16, 16);
                }
                if (coord.equals(Coord.fromNumber(0, -1))) {
                    setEmpty(chunk, 0, 13, 4, 16);
                }
                if (coord.equals(Coord.fromNumber(-1, 0))) {
                    setEmpty(chunk, 13, 0, 16, 4);
                }
                if (coord.equals(Coord.fromNumber(0, 0))) {
                    setEmpty(chunk, 0, 0, 4, 4);
                }
                // DBに書き込む？
            }
            this.viewPointChunks.putByCoord(coord, chunk);
            this.players.get(coord).forEach(player => {
                player.putChunk(coord, chunk);
            });
        });
    }

    getViewPointChunk(coord: Coord) {
        try {
            return super.getViewPointChunk(coord);
        } catch (error) {
            if (error.name !== ChunkNotFoundError.name)
                throw error;
            return null;
        }
    }
}

/** 16x16の地形を作成する */
function createViewPointChunk(): vp.ViewPoint[][] {
    var chunk = [];
    for (var y = 0; y < 16; y++) {
        var line = [];
        for (var x = 0; x < 16; x++) {
            line.push(new vp.ViewPoint(
                Math.random() < 0.4 ? vp.Landform.BOMB : vp.Landform.NONE,
                vp.Status.CLOSE));
        }
        chunk.push(line);
    }
    return chunk;
}

function setEmpty(chunk: vp.ViewPoint[][], xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
    for (var y = yBegin; y < yEnd; y++) {
        for (var x = xBegin; x < xEnd; x++) {
            chunk[y][x].status = vp.Status.OPEN;
            chunk[y][x].landform = vp.Landform.NONE;
        }
    }
}

class CoordMultiMap extends MultiMap<Coord, Player> {
    /** @protected */
    createKey(key: Coord): string {
        return key.toString();
    }
}

var __scope: MultiMap<any, any> = new MultiMap<any,any>();// MultiMapのimportが消えるためやむなく