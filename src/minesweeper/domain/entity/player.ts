import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');

export = Player;
class Player {
    constructor(
        public coord: Coord,
        /**
         hiyoko, hiyoko_lady, mecha_hiyoko, niwatori, waru_hiyoko, remilia
         */
        public image: string
        ) {
    }
}
