import iv = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../minesweeper-common/infrastructure/service/dxo');
import Player = require('./../domain/entity/player');
import Landform = require('./../domain/entity/landform');

export function toMineWorld(dto: iv.IFullDataDTO, field: Landform) {
    return {
        yourId: dto.yourId,
        players: Enumerable.from(dto.activePlayers)
            .select(x => ({ key: x.key, value: toPlayer(x.value, field) }))
            .toObject(x => x.key, x => x.value)
    };
}

export function toPlayer(dto: iv.IPlayerDTO, field: Landform): Player {
    return new Player(
        cdxo.toCoord(dto.coord),
        dto.image,
        field);
}
