import Enumerable = require('./../../../lib/linq');
import Player = require('./../entity/player');

export = playersRepository;
module playersRepository {
    /** DB‚È‚ñ‚©–³‚©‚Á‚½ */
    var players: IHash<Player> = {};

    export function get(id: number) {
        return players[id];
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