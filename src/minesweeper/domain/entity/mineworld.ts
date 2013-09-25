import ee2 = require('eventemitter2');
import Enumerable = require('./../../lib/linq');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import playersRepository = require('./../repository/playersrepository');
import Player = require('./player');

export = MineWorld;
class MineWorld extends ee2.EventEmitter2 {
    activePlayers: { [key: number]: Player } = {};

    constructor() {
        super();
    }

    createPlayer() {
        var player = new Player(Coord.of('0', '0'), 'remilia');
        var id = playersRepository.create(player);
        this.activePlayers[id] = player;
        super.emit('player_activated', { id: id, player: player });
        return id;
    }

    activatePlayer(id: number) {
        var player = playersRepository.get(id);
        this.activePlayers[id] = player;
        super.emit('player_activated', { id: id, player: player });
    }

    deactivatePlayer(id: number) {
        var player = this.activePlayers[id];
        playersRepository.put(id, player);
        delete this.activePlayers[id];
        super.emit('player_deactivated', { id: id, player: player });
    }

    /** �ړ��o�H�m��̓T�[�o�[���ōs�� */
    movePlayer(id: number, coord: Coord) {
    }
}
