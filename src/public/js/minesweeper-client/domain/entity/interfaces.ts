import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');

export interface IClientSocket {
    move(coord: Coord);
    dig(coord: Coord);
    flag(coord: Coord);
    question(coord: Coord);
    removeQuestion(coord: Coord);
}