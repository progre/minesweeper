import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import Landform = require('./landform');
import ClientSocket = require('./clientsocket');

export = Player;
class Player {
    private socket: ClientSocket;
    private field: Landform;

    constructor(
        public coord: Coord,
        public image: string) {
    }

    setSocket(socket: ClientSocket) {
        this.socket = socket;
    }

    setField(field: Landform) {
        this.field = field;
    }

    action(primary: boolean, coord: Coord) {
        if (this.field == null)
            return;
        var path = this.field.pathFinder.find(this.coord, coord);
        if (path.length === 0)
            return;

        var tile: ClientTile = this.field.getTile(coord);
        if (tile == null || tile.status !== enums.Status.CLOSE) {
            this.socket.move(coord);
            return;
        }
        if (primary) {
            this.socket.dig(coord);
            return;
        }
        switch (tile.layer) {
            case enums.Layer.NONE:
                this.socket.flag(coord);
                break;
            case enums.Layer.FLAG:
                this.socket.question(coord);
                break;
            case enums.Layer.QUESTION:
                this.socket.removeQuestion(coord);
                break;
        }
    }
}