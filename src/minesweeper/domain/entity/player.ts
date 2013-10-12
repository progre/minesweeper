var log4js = require('log4js');
import ee2 = require('eventemitter2');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import ifs = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');

var logger = log4js.getLogger();

export = Player;
class Player extends ee2.EventEmitter2 {
    private events: { event: string; listener: Function }[] = [];
    private movingTimeoutId = null;
    private path: Coord[];

    constructor(
        public coord: Coord,
        /**
         hiyoko, hiyoko_lady, mecha_hiyoko, niwatori, waru_hiyoko, remilia
         */
        public image: string,
        /** 受信用 */
        private emitter: EventEmitter) {

        super();
        // イベントの初期化
        this.init();
    }

    private init() {
        if (this.emitter == null)
            return;

        this.defineEvent('join_chunk', (coord: ifs.ICoordDTO) => {
            super.emit('join_chunk', cdxo.toCoord(coord));
        });
        this.defineEvent('defect_chunk', (coord: ifs.ICoordDTO) => {
            super.emit('defect_chunk', cdxo.toCoord(coord));
        });
        this.defineEvent('move', (coord: ifs.ICoordDTO) => {
            logger.info(coord);
        });
        this.defineEvent('dig', (coord: ifs.ICoordDTO) => {
            super.emit('moving', cdxo.toCoord(coord));
        });
        this.defineEvent('flag', (coord: ifs.ICoordDTO) => {
            logger.info(coord);
        });

        this.events.forEach(x => this.emitter.on(x.event, x.listener));
    }

    dispose() {
        this.events.forEach(x => this.emitter.removeListener(x.event, x.listener));
    }

    putChunk(coord: Coord, chunk: vp.ViewPoint[][]) {
        this.emitter.emit('chunk', { coord: cdxo.fromCoord(coord), chunk: chunk });
    }

    move(path: Coord[]) {
        this.path = path;
        this.delayMove();
    }

    private defineEvent(event: string, listener: Function) {
        this.events.push({ event: event, listener: listener });
    }

    private delayMove() {
        if (this.movingTimeoutId != null)
            return;
        if (this.path.length <= 0)
            return;
        this.coord = this.path.shift();
        super.emit('moved', this.coord);
        this.movingTimeoutId = setTimeout(() => {
            this.movingTimeoutId = null;
            this.delayMove();
        }, 100);
    }
}

