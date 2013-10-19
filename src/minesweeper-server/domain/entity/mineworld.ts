var log4js = require('log4js');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import playersRepository = require('./../../infrastructure/playersrepository');
import dxo = require('./../../infrastructure/dxo');
import Player = require('./player');
import Landform = require('./landform');

var logger = log4js.getLogger();

export = MineWorld;
class MineWorld {
    activePlayers: { [key: number]: Player } = {};
    private landform = new Landform();

    constructor(
        /** プレイヤー全体に通知するemitter */
        private emitter: EventEmitter) {

        // スタート地点のChunkは最初に作っておく
        this.landform.getViewPointChunk(Coord.fromNumber(-1, -1));
        this.landform.getViewPointChunk(Coord.fromNumber(0, -1));
        this.landform.getViewPointChunk(Coord.fromNumber(-1, 0));
        this.landform.getViewPointChunk(Coord.fromNumber(0, 0));
    }

    /** プレイヤーを作ってリポジトリに保存する */
    createPlayer() {
        var player = Player.create();
        return playersRepository.create(player);
    }

    activatePlayer(id: number, emitter: EventEmitter) {
        var player = playersRepository.get(id, emitter);
        if (player == null)
            throw new Error();
        this.deactivatePlayerIfExist(id);
        this.activePlayers[id] = player;
        player.setField(this.landform);
        player.on('moved', (coord: Coord) => {
            this.emitter.emit('moved', { id: id, coord: cdxo.fromCoord(coord) });
        });
        player.on('join_chunk', (coord: Coord) => {
            this.landform.join(coord, player);
        });
        player.on('defect_chunk', (coord: Coord) => {
            this.landform.defect(coord, player);
        });
        logger.info('activate player. id: ' + id);
        this.emitter.emit('player_activated', { id: id, player: dxo.fromPlayer(player) });
    }

    deactivatePlayer(id: number) {
        var player = this.activePlayers[id];
        if (player == null) {
            logger.warn('player is not exist. id: ' + id);
            return;
        }
        this.deactivate(id, player);
    }

    private deactivatePlayerIfExist(id: number) {
        var player = this.activePlayers[id];
        if (player == null)
            return;
        this.deactivate(id, player);
    }

    private deactivate(id: number, player: Player) {
        this.landform.defectAll(player);
        playersRepository.put(id, player);
        player.dispose();
        delete this.activePlayers[id];
        logger.info('deactivate player. id: ' + id);
        this.emitter.emit('player_deactivated', { id: id, player: dxo.fromPlayer(player) });
    }
}
