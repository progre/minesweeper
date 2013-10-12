var log4js = require('log4js');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import playersRepository = require('./../../infrastructure/playersrepository');
import dxo = require('./../../infrastructure/dxo');
import findPath = require('./../service/astar');
import Player = require('./player');
import Landform = require('./landform');

var logger = log4js.getLogger();

export = MineWorld;
class MineWorld {
    activePlayers: { [key: number]: Player } = {};
    map = new Landform();

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
        player.on('moving', (coord: Coord) => {
            if (isNaN(player.coord.distance(coord)))
                return;
            player.move(findPath(this.map, player.coord, coord));
        });
        player.on('moved', (coord: Coord) => {
            this.emitter.emit('moved', { id: id, coord: cdxo.fromCoord(coord) });
        });
        player.on('join_chunk', (coord: Coord) => {
            this.map.join(coord, player);
        });
        player.on('defect_chunk', (coord: Coord) => {
            this.map.defect(coord, player);
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
        this.map.defectAll(player);
        playersRepository.put(id, player);
        player.dispose();
        delete this.activePlayers[id];
        logger.info('deactivate player. id: ' + id);
        this.emitter.emit('player_deactivated', { id: id, player: dxo.fromPlayer(player) });
    }
}
