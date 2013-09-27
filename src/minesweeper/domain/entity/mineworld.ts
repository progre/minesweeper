import events = require('events');
import Enumerable = require('./../../lib/linq');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import playersRepository = require('./../../infrastructure/playersrepository');
import dxo = require('./../../infrastructure/dxo');
import Player = require('./player');

export = MineWorld;
class MineWorld {
    activePlayers: { [key: number]: Player } = {};

    constructor(
        private emitter: events.EventEmitter) {
    }

    createPlayer() {
        var player = new Player(Coord.of('0', '0'), 'remilia');
        var id = playersRepository.create(player);
        this.activePlayers[id] = player;
        if (player == null)
            throw new Error();
        this.emitter.emit('player_activated', { id: id, player: dxo.fromPlayer(player) });
        return id;
    }

    activatePlayer(id: number) {
        var player = playersRepository.get(id);
        this.activePlayers[id] = player;
        if (player == null)
            throw new Error();
        this.emitter.emit('player_activated', { id: id, player: dxo.fromPlayer(player) });
    }

    deactivatePlayer(id: number) {
        var player = this.activePlayers[id];
        playersRepository.put(id, player);
        delete this.activePlayers[id];
        if (player == null)
            throw new Error();
        this.emitter.emit('player_deactivated', { id: id, player: dxo.fromPlayer(player) });
    }

    /** 移動経路確定はサーバー側で行う */
    movePlayer(id: number, coord: Coord) {
    }

    /** 移動経路確定はサーバー側で行う */
    digPlayer(id: number, coord: Coord) {
        this.activePlayers[id].coord = coord;
        this.emitter.emit('digged', { id: id, coord: cdxo.fromCoord(coord) });
    }
}
