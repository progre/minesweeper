import iv = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../minesweeper-common/infrastructure/service/dxo');
import Player = require('./../domain/entity/player');
import Landform = require('./../domain/entity/landform');

export function toPlayer(dto: iv.IPlayerDTO): Player {
    return new Player(
        cdxo.toCoord(dto.coord),
        dto.image);
}
