import ee2 = require('eventemitter2');
import PlayerBase = require('./../../../minesweeper-common/domain/entity/playerbase');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import Landform = require('./landform');
import ifs = require('./interfaces');

export = Player;
class Player extends PlayerBase {
    private socket: ifs.IClientSocket;

    constructor(coord: Coord, image: string) {
        super(coord, image);
    }

    setSocket(socket: ifs.IClientSocket) {
        this.socket = socket;
    }

    setField(field: Landform) {
        this.field = field;
    }

    action(primary: boolean, coord: Coord) {
        var tile: ClientTile = this.field.getTile(coord);
        if (tile == null || tile.status !== enums.Status.CLOSE) {
            if (!super.beginMove(enums.Intent.MOVING, coord))
                return;
            this.socket.move(coord);
            return;
        }
        if (primary) {
            if (!super.beginMove(enums.Intent.DIGGING, coord))
                return;
            this.socket.dig(coord);
            return;
        }
        switch (tile.layer) {
            case enums.Layer.NONE:
                if (!super.beginMove(enums.Intent.FLAG, coord))
                    return;
                this.socket.flag(coord);
                break;
            case enums.Layer.FLAG:
                if (!super.beginMove(enums.Intent.QUESTION, coord))
                    return;
                this.socket.question(coord);
                break;
            case enums.Layer.QUESTION:
                if (!super.beginMove(enums.Intent.REMOVE_QUESTION, coord))
                    return;
                this.socket.removeQuestion(coord);
                break;
        }
    }
}
