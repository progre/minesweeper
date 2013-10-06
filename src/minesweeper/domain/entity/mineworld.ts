var log4js = require('log4js');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import playersRepository = require('./../../infrastructure/playersrepository');
import dxo = require('./../../infrastructure/dxo');
import Player = require('./player');
import ServerMap = require('./servermap');

var logger = log4js.getLogger();

export = MineWorld;
class MineWorld {
    activePlayers: { [key: number]: Player } = {};
    map = new ServerMap();

    constructor(
        /** プレイヤー全体に通知するemitter */
        private emitter: EventEmitter) {
    }

    /** プレイヤーを作ってリポジトリに保存する */
    createPlayer() {
        var player = new Player(Coord.of('0', '0'), 'remilia', null);
        return playersRepository.create(player);
    }

    activatePlayer(id: number, emitter: EventEmitter) {
        var player = playersRepository.get(id, emitter);
        if (player == null)
            throw new Error();
        this.deactivatePlayerIfExist(id);
        this.activePlayers[id] = player;
        player.on('moved', (coord: Coord) => {
            this.emitter.emit('moved', { id: id, coord: cdxo.fromCoord(coord) });
        });
        player.on('join_chunk', (coord: Coord) => {
            var chunk = this.map.getViewPointChunk(coord);
            if (chunk != null) {
                player.putChunk(chunk);
            }
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
        playersRepository.put(id, player);
        player.dispose();
        delete this.activePlayers[id];
        logger.info('deactivate player. id: ' + id);
        this.emitter.emit('player_deactivated', { id: id, player: dxo.fromPlayer(player) });
    }
}
