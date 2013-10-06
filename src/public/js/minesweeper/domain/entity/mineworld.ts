import ee2 = require('eventemitter2');
import ViewPoint = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
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
        emitter.on('chunk', (obj: ViewPoint[][]) => {
        });
        emitter.on('opened', () => {
        });
        emitter.on('flagged', () => {
        });
        emitter.on('bombed', () => {
        });
    }

    move(coord: Coord) {
        this.emitter.emit('move', cdxo.fromCoord(coord));
    }

    dig(coord: Coord) {
        this.emitter.emit('dig', cdxo.fromCoord(coord));
    }

    flag(coord: Coord) {
        this.emitter.emit('flag', cdxo.fromCoord(coord));
    }
}
