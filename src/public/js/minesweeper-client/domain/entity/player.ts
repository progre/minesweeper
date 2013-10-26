import ee2 = require('eventemitter2');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import Landform = require('./landform');
import ifs = require('./interfaces');

export = Player;
class Player extends ee2.EventEmitter2 {
    private field: Landform;
    private movingTimeoutId = null;
    private path: Coord[];
    private socket: ifs.IClientSocket;

    constructor(
        public coord: Coord,
        public image: string) {

        super();
    }

    setSocket(socket: ifs.IClientSocket) {
        this.socket = socket;
    }

    setField(field: Landform) {
        this.field = field;
    }

    action(primary: boolean, coord: Coord) {
        if (this.field == null)
            return;
        this.path = this.field.pathFinder.find(this.coord, coord);
        if (this.path.length === 0)
            return;
        var tile: ClientTile = this.field.getTile(coord);
        if (tile == null || tile.status !== enums.Status.CLOSE) {
            this.socket.move(coord);
            this.delayMove(Intent.MOVING);
            return;
        }
        if (primary) {
            this.socket.dig(coord);
            this.delayMove(Intent.DIGGING);
            return;
        }
        switch (tile.layer) {
            case enums.Layer.NONE:
                this.socket.flag(coord);
                this.delayMove(Intent.FLAG);
                break;
            case enums.Layer.FLAG:
                this.socket.question(coord);
                this.delayMove(Intent.QUESTION);
                break;
            case enums.Layer.QUESTION:
                this.socket.removeQuestion(coord);
                this.delayMove(Intent.REMOVE_QUESTION);
                break;
        }
    }

    private delayMove(intent: Intent) {
        if (this.movingTimeoutId != null) // タイムアウトが仕込まれている場合は中断
            return;
        if (this.path.length <= 0)
            return;
        var coord = this.path.shift();
        if (!this.field.move(this, coord)) {
            if (intent === Intent.MOVING
                || this.path.length > 0
                || this.field.getTile(coord).status !== enums.Status.CLOSE) {
                this.path = [];
                return;
            }
            switch (intent) {
                case Intent.FLAG:
                    this.field.setLayer(coord, enums.Layer.FLAG);
                    return;
                case Intent.QUESTION:
                    this.field.setLayer(coord, enums.Layer.QUESTION);
                    return;
                case Intent.REMOVE_QUESTION:
                    this.field.setLayer(coord, enums.Layer.NONE);
                    return;
                case Intent.DIGGING:
                    this.field.dig(coord);
                    return;
            }
        }
        super.emit('moved', this.coord);
        this.movingTimeoutId = setTimeout(() => {
            this.movingTimeoutId = null;
            this.delayMove(intent);
        }, 100);
    }
}

enum Intent {
    MOVING, DIGGING, FLAG, QUESTION, REMOVE_QUESTION
}
