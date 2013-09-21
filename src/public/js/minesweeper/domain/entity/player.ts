import Coord = require('./../valueobject/coord');

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
