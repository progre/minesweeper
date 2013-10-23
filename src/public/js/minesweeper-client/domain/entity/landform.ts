import ee2 = require('eventemitter2');
import Enumerable = require('./../../../lib/linq');
import LandformBase = require('./../../../minesweeper-common/domain/entity/landformbase');
import PathFinder = require('./../../../minesweeper-common/domain/entity/pathfinder');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientSocket = require('./clientsocket');

export = Landform;
class Landform extends LandformBase {
    pathFinder = new PathFinder(this);
    private socket: ClientSocket;
    private joinRequests: { [coord: string]: Date } = {};

    setSocket(socket: ClientSocket) {
        this.socket = socket;
        socket.onChunk(obj => {
            console.log('Chunk' + obj.coord.toString() + 'を受信しました');
            delete this.joinRequests[obj.coord.toString()];
            this.putTileChunk(obj.coord, obj.chunk);
        });
        socket.onTile(obj => {
            console.log('tile' + obj.coord.toString() + 'を受信しました');
            this.putTile(obj.coord, obj.tile);
        });
        socket.onExploded(coord => {
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
        if (this.socket == null)
            return;
        var req = this.joinRequests[coord.toString()];
        if (req != null && Date.now() - req.getTime() < 5 * 1000)
            return;
        this.joinRequests[coord.toString()] = new Date();
        this.socket.joinChunk(coord);
        console.log('Chunk' + coord.toString() + 'を要求しました');
    }
}
