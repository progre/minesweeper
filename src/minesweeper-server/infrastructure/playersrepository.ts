import Enumerable = require('./../../lib/linq');
import Player = require('./../domain/entity/player');

export = playersRepository;
module playersRepository {
    /** DBなんか無かった */
    var players: IHash<Player> = {};

    export function get(id: number, emitter: EventEmitter) {
        return new Player(players[id].coord, players[id].image, emitter);
    }

    export function put(id: number, player: Player) {
        players[id] = player;
    }

    export function create(player: Player) {
        var id = countPlayers();
        players[id] = player;
        return id;
    }

    function countPlayers() {
        return Enumerable.from(players).count();
    }
}

interface IHash<T> {
    [key: string]: T;
}