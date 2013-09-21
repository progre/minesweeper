import Coord = require('./../valueobject/coord');
import Player = require('./player');

export = MineWorld;
class MineWorld extends EventEmitter2 {
    players: { [id: number]: Player } = {};

    /** 何らかの方法でサーバーの状態をロード */
    static load() {
    }

    /** デバッグ用 */
    static createLocal() {
        var world = new MineWorld();
        world.addPlayer(0, new Player(Coord.of('0', '0'), 'remilia'));
        return world;
    }

    constructor() {
        super();
    }

    update() {
    }

    addPlayer(id: number, player: Player) {
        this.players[id] = player;
        super.emit('player_added', id, player);
    }

    removePlayer(id: number) {
        var removed = this.players[id];
        this.players[id] = null;
        super.emit('player_removed', id, removed);
    }

    /** 移動経路確定はサーバー側で行う */
    movePlayer(id: number, coord: Coord) {
        this.players[id].coord = coord;
    }
}
