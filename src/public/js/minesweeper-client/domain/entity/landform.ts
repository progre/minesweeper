import Enumerable = require('./../../../lib/linq');
import LandformBase = require('./../../../minesweeper-common/domain/entity/landformbase');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientSocket = require('./clientsocket');
import Player = require('./player');

export = Landform;
class Landform extends LandformBase {
    private socket: ClientSocket;
    private joinRequests: { [coord: string]: Date } = {};

    setSocket(socket: ClientSocket) {
        this.socket = socket;
        socket.onChunk(obj => {
            delete this.joinRequests[obj.coord.toString()];
            this.putTileChunk(obj.coord, obj.chunk);
        });
        socket.onTile(obj => {
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
    }
}
