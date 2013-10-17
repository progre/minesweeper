var log4js = require('log4js');
import Enumerable = require('./../../../lib/linq');
import LandformBase = require('./../../../minesweeper-common/domain/entity/landformbase');
import ChunkNotFoundError = require('./../../../minesweeper-common/domain/entity/chunknotfounderror');
import PathFinder = require('./../../../minesweeper-common/domain/entity/pathfinder');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import Tile = require('./../../../minesweeper-common/domain/valueobject/tile');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import MultiMap = require('./multimap');
import Player = require('./player');

var logger = log4js.getLogger();

export = Landform;
class Landform extends LandformBase {
    pathFinder: PathFinder;
    private players = new CoordMultiMap();

    constructor() {
        super();
        this.pathFinder = new PathFinder(this);
    }

    /** @override */
    getViewPoint(coord: Coord): Tile {
        var tile = super.getViewPoint(coord);
        if (tile == null)
            return Tile.UNKNOWN;
        return tile;
    }

    join(coord: Coord, player: Player) {
        logger.debug('player join to: ' + coord.toString());
        this.players.put(coord, player);
        var chunk = this.getClientViewPointChunk(coord);
        if (chunk == null)
            return;
        player.notifyChunk(coord, chunk);
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
        (callback => callback(null))((chunk: Chunk<Tile>) => {
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
                player.notifyChunk(coord, clientChunk);
            });
        });
    }

    getClientViewPointChunk(coord: Coord): Chunk<ClientTile> {
        var chunk = this.getViewPointChunk(coord);
        if (chunk == null) {
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
        return this.getViewPoint(coord).isMovable();
    }

    dig(coord: Coord) {
        var tile = this.getViewPoint(coord);
        tile.status = enums.Status.OPEN;
        var clientTile = this.toClientTile(tile, coord);
        var players = this.players.get(Chunk.coordFromGlobal(coord));
        if (tile.landform === enums.Landform.BOMB) {
            players.forEach(player =>
                player.notifyExploded(coord)); // これだけでtileがopenでbombなことも伝わる
        } else {
            players.forEach(player =>
                player.notifyTile(coord, clientTile));
        }
    }

    setLayer(coord: Coord, layer: enums.Layer) {
        var tile = this.getViewPoint(coord);
        tile.layer = layer;
        var clientTile = this.toClientTile(tile, coord);
        var players = this.players.get(Chunk.coordFromGlobal(coord));
        players.forEach(player =>
            player.notifyTile(coord, clientTile));
    }

    private toClientTile(tile: Tile, coord: Coord) {
        if (tile == null)
            return null;
        var around = this.getArounds(coord);
        return new ClientTile(
            tile.status !== enums.Status.OPEN ? enums.Landform.UNKNOWN
            : tile.landform,
            tile.status,
            tile.layer,
            tile.status !== enums.Status.OPEN ? -1
            : around.any(x => x.landform === enums.Landform.UNKNOWN) ? -1
            : around.count(x=> x.landform === enums.Landform.BOMB));
    }

    /** 
     * @param chunk chunk
     * @param coord chunkの座標(Chunk座標系)
     */
    private toClientChunk(chunk: Chunk<Tile>, chunkCoord: Coord): Chunk<ClientTile> {
        var baseCoord = Chunk.toGlobal(chunkCoord);
        return chunk.map((tile: Tile, coord?: Coord)
            => this.toClientTile(tile, baseCoord.add(coord)));
    }

    private getArounds(coord: Coord) {
        return Enumerable.from(coord.getArounds())
            .select(x => this.getViewPointWithoutRequest(x));
    }

    private getViewPointWithoutRequest(coord: Coord) {
        try {
            return this.viewPointChunks.getShred(coord);
        } catch (error) {
            if (error.name !== ChunkNotFoundError.name)
                throw error;
            return Tile.UNKNOWN;
        }
    }
}

function isMovable(viewPoint: Tile) {
    return viewPoint.status === enums.Status.OPEN
        && viewPoint.landform === enums.Landform.NONE;
}

/** 16x16の地形を作成する */
function createViewPointChunk(): Chunk<Tile> {
    var chunk: Tile[][] = [];
    for (var y = 0; y < 16; y++) {
        var line = [];
        for (var x = 0; x < 16; x++) {
            line.push(new Tile(
                Math.random() < 0.25 ? enums.Landform.BOMB : enums.Landform.NONE,
                enums.Status.CLOSE,
                enums.Layer.NONE));
        }
        chunk.push(line);
    }
    return new Chunk<any>(chunk);// HACK: Client<Tile>とすべき
}

function setEmpty(chunk: Chunk<Tile>, xBegin: number, yBegin: number, xEnd: number, yEnd: number) {
    for (var y = yBegin; y < yEnd; y++) {
        for (var x = xBegin; x < xEnd; x++) {
            var viewPoint = chunk.get(x, y);
            viewPoint.status = enums.Status.OPEN;
            viewPoint.landform = enums.Landform.NONE;
        }
    }
}

class CoordMultiMap extends MultiMap<Coord, Player> {
    /** @protected */
    createKey(key: Coord): string {
        return key.toString();
    }
}

function createUnknownChunk(): Chunk<Tile> {
    return new Chunk(Enumerable.generate(() =>
        Enumerable.generate(() =>
            new Tile(enums.Landform.UNKNOWN, enums.Status.UNKNOWN, enums.Layer.UNKNOWN),
            16).toArray(),
        16).toArray());
}

var __scope: MultiMap<any, any> = new MultiMap<any, any>();// MultiMapのimportが消えるためやむなく