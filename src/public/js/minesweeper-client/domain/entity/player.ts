import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import Landform = require('./landform');

export = Player;
class Player {
    private emitter: Socket;
    private field: Landform;

    constructor(
        public coord: Coord,
        public image: string) {
    }

    setEmitter(emitter: Socket) {
        this.emitter = emitter;
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
            this.emitter.emit('move', cdxo.fromCoord(coord));
            return;
        }
        if (primary) {
            this.emitter.emit('dig', cdxo.fromCoord(coord));
            return;
        }
        switch (tile.layer) {
            case enums.Layer.NONE:
                this.emitter.emit('flag', cdxo.fromCoord(coord));
                break;
            case enums.Layer.FLAG:
                this.emitter.emit('question', cdxo.fromCoord(coord));
                break;
            case enums.Layer.QUESTION:
                this.emitter.emit('remove_question', cdxo.fromCoord(coord));
                break;
        }
    }
}