import Enumerable = require('./../../lib/linq');
import Player = require('./../domain/entity/player');
import iv = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../minesweeper-common/infrastructure/service/dxo');

export function fromActivePlayers(activePlayers: { [key: number]: Player }): IHash<iv.IPlayerDTO> {
    return Enumerable.from(activePlayers)
        .toObject(x => x.key, x => fromPlayer(x.value));
}

export function fromPlayer(player: Player): iv.IPlayerDTO {
    return {
        coord: cdxo.fromCoord(player.coord),
        image: player.image
    };
}

export interface IHash<T> {
    [key: number]: T
}