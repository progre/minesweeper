import ee2 = require('eventemitter2');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import iv = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import dxo = require('./../../infrastructure/dxo');
import ActivePlayers = require('./activeplayers');
import Landform = require('./landform');

export = MineWorld;
class MineWorld {
    activePlayers = new ActivePlayers();
    landform = new Landform();
    /** infrastructure */
    /** イベント受信用 */
    private emitter: Socket;

    setEmitter(emitter: Socket) {
        this.emitter = emitter;
        this.activePlayers.setEmitter(emitter);
        this.landform.setEmitter(emitter);

        emitter.on('full_data', (dto: iv.IFullDataDTO) => {
            var model = dxo.toMineWorld(dto, this.landform);
            console.log('プレイヤー' + Enumerable.from(model.players).count() + '人が参加中');
            this.activePlayers.setPlayers(model.players, this.landform);
            this.activePlayers.setCentralPlayer(model.yourId);
        });
    }
}
