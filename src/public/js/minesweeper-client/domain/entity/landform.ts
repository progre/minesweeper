import ee2 = require('eventemitter2');
import Enumerable = require('./../../../lib/linq');
import LandformBase = require('./../../../minesweeper-common/domain/entity/landformbase');
import PathFinder = require('./../../../minesweeper-common/domain/entity/pathfinder');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import ifs = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');

export = Landform;
class Landform extends LandformBase {
    pathFinder = new PathFinder(this);
    private emitter: Socket;
    private joinRequests: { [coord: string]: Date } = {};

    setEmitter(emitter: Socket) {
        this.emitter = emitter;
        emitter.on('chunk', (obj: { coord: ifs.ICoordDTO; chunk: ClientTile[][] }) => {
            console.log('Chunk' + cdxo.toCoord(obj.coord).toString() + 'を受信しました');
            delete this.joinRequests[obj.coord.toString()];
            this.putTileChunk(
                cdxo.toCoord(obj.coord),
                new Chunk<any>(obj.chunk));// HACK: Chunk<ClientTile>とすべき
        });
        emitter.on('tile', (obj: { coord: ifs.ICoordDTO; tile: ClientTile }) => {
            console.log('tile' + cdxo.toCoord(obj.coord).toString() + 'を受信しました');
            this.putTile(cdxo.toCoord(obj.coord), obj.tile);
        });
        emitter.on('opened', () => {
        });
        emitter.on('flagged', () => {
        });
        emitter.on('exploded', (coordDTO: ifs.ICoordDTO) => {
            var coord = cdxo.toCoord(coordDTO);
            this.putTile(coord, new ClientTile(
                enums.Landform.BOMB,
                enums.Status.OPEN,
                enums.Layer.NONE,
                -1));
            this.emit('exploded', coord);
        });
    }

    isMovable(coord: Coord) {
        var tile: ClientTile = this.getTile(coord);
        return tile != null
            && tile.status === enums.Status.OPEN
            && tile.landform === enums.Landform.NONE;
    }

    /** @override */
    /** @protected */
    requestTileChunk(coord: Coord): void {
        if (this.emitter == null)
            return;
        var req = this.joinRequests[coord.toString()];
        if (req != null && Date.now() - req.getTime() < 5 * 1000)
            return;
        this.joinRequests[coord.toString()] = new Date();
        this.emitter.emit('join_chunk', cdxo.fromCoord(coord));
        console.log('Chunk' + coord.toString() + 'を要求しました');
    }
}
