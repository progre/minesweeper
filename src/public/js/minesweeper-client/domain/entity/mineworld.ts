import ee2 = require('eventemitter2');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import iv = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import ActivePlayers = require('./activeplayers');
import Landform = require('./landform');

export = MineWorld;
class MineWorld {
    activePlayers = new ActivePlayers();
    landform = new Landform();
    /** infrastructure */
    /** イベント受信用 */
    private emitter: ee2.EventEmitter2;

    setEmitter(emitter: ee2.EventEmitter2) {
        this.emitter = emitter;
        this.activePlayers.setEmitter(emitter);
        this.landform.setEmitter(emitter);

        emitter.on('full_data', (dto: iv.IFullDataDTO) => {
            var model = cdxo.toMineWorld(dto);
            console.log('プレイヤー' + Enumerable.from(model.players).count() + '人が参加中');
            this.activePlayers.setPlayers(model.players);
            this.activePlayers.setCentralPlayer(model.yourId);
        });
    }

    action(primary: boolean, coord: Coord) {
        var tile: ClientTile = this.landform.getTile(coord);
        if (tile == null || tile.status !== enums.Status.CLOSE) {
            this.emitter.emit('move', cdxo.fromCoord(coord));
            return;
        }
        if (primary) {
            this.emitter.emit('dig', cdxo.fromCoord(coord));
        } else {
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
}