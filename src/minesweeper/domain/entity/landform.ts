var log4js = require('log4js');
import Enumerable = require('./../../../lib/linq');
import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import ChunkNotFoundError = require('./../../../minesweeper-common/domain/entity/chunknotfounderror');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import MultiMap = require('./multimap');
import Player = require('./player');
import PathFinder = require('./pathfinder');

var logger = log4js.getLogger();

export = Landform;
class Landform extends MapBase {
    pathFinder: PathFinder;
    private players = new CoordMultiMap();

    constructor() {
        super();
        this.pathFinder = new PathFinder(this);
    }

    join(coord: Coord, player: Player) {
        logger.debug('player join to: ' + coord.toString());
        this.players.put(coord, player);
        var chunk = this.getClientViewPointChunk(coord);
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
        (callback => callback(null))((chunk: Chunk<vp.ViewPoint>) => {
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
            var clientChunk = this.toClientChunk(chunk, coord);
            this.players.get(coord).forEach(player => {
                player.putChunk(coord, clientChunk);
            });
        });
    }

    getClientViewPointChunk(coord: Coord): vp.ClientViewPoint[][] {
        var chunk: Chunk<vp.ViewPoint>;
        try {
            chunk = super.getViewPointChunk(coord);
        } catch (error) {
            if (error.name !== ChunkNotFoundError.name)
                throw error;
            return null;
        }
        return this.toClientChunk(chunk, coord);
    }

    move(player: Player, to: Coord) {
        if (!this.isMovable(to))
            return false;
        player.coord = to;
        return true;
    }

    isMovable(coord: Coord) {
        return isMovable(this.getViewPoint(coord));
    }

    dig(coord: Coord) {
        super.getViewPoint(coord).status = vp.Status.OPEN;
        var clientViewPoint = this.toClientViewPoint(this.getViewPoint(coord), coord);
        this.players.get(Chunk.coordFromGlobal(coord)).forEach(player => {
            player.putViewPoint(coord, clientViewPoint);
        });
    }

    flag(coord: Coord) {
    }

    private toClientViewPoint(viewPoint: vp.ViewPoint, coord: Coord) {
        var around = this.getArounds(coord);
        return new vp.ClientViewPoint(
            viewPoint.status,
            around.any(x => x.landform === vp.Landform.UNKNOWN) ? -1
            : around.count(x=> x.landform === vp.Landform.BOMB));
    }

    /** 
     * @param chunk chunk
     * @param coord chunkの座標(Chunk座標系)
     */
    private toClientChunk(chunk: Chunk<vp.ViewPoint>, chunkCoord: Coord) {
        var baseCoord = Chunk.toGlobal(chunkCoord);
        return chunk.map((tile: vp.ViewPoint, coord?: Coord)
            => this.toClientViewPoint(tile, baseCoord.add(coord)));
    }

    private getArounds(coord: Coord) {
        return Enumerable.from(coord.getArounds())
            .select(x => super.getViewPoint(x));
    }
}

function isMovable(viewPoint: vp.ViewPoint) {
    return viewPoint.status === vp.Status.OPEN
        && viewPoint.landform === vp.Landform.NONE;
}

/** 16x16の地形を作成する */
function createViewPointChunk(): Chunk<vp.ViewPoint> {
    var chunk: vp.ViewPoint[][] = [];
    for (var y = 0; y < 16; y++) {
        var line = [];
        for (var x = 0; x < 16; x++) {
            line.push(new vp.ViewPoint(
                Math.random() < 0.4 ? vp.Landform.BOMB : vp.Landform.NONE,
                vp.Status.CLOSE));
        }
        chunk.push(line);
    }
    return new Chunk<vp.ViewPoint>(chunk);
}

function setEmpty(chunk: Chunk<vp.ViewPoint>, xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
    for (var y = yBegin; y < yEnd; y++) {
        for (var x = xBegin; x < xEnd; x++) {
            var viewPoint = chunk.get(x, y);
            viewPoint.status = vp.Status.OPEN;
            viewPoint.landform = vp.Landform.NONE;
        }
    }
}

class CoordMultiMap extends MultiMap<Coord, Player> {
    /** @protected */
    createKey(key: Coord): string {
        return key.toString();
    }
}

var __scope: MultiMap<any, any> = new MultiMap<any, any>();// MultiMapのimportが消えるためやむなく