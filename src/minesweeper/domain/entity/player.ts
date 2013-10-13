var log4js = require('log4js');
import ee2 = require('eventemitter2');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import ifs = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import Landform = require('./landform');

var logger = log4js.getLogger();

export = Player;
class Player extends ee2.EventEmitter2 {
    private events: { event: string; listener: Function }[] = [];
    private movingTimeoutId = null;
    private path: Coord[];
    /** 視界 */
    private field: Landform;

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
            this.beginMove(Intent.DIGGING, cdxo.toCoord(coord));
        });
        this.defineEvent('flag', (coord: ifs.ICoordDTO) => {
            logger.info(coord);
        });

        this.events.forEach(x => this.emitter.on(x.event, x.listener));
    }

    dispose() {
        this.events.forEach(x => this.emitter.removeListener(x.event, x.listener));
    }

    private defineEvent(event: string, listener: Function) {
        this.events.push({ event: event, listener: listener });
    }

    setField(field: Landform) {
        this.field = field;
    }

    putChunk(coord: Coord, chunk: vp.ClientViewPoint[][]) {
        this.emitter.emit('chunk', { coord: cdxo.fromCoord(coord), chunk: chunk });
    }

    putViewPoint(coord: Coord, viewPoint: vp.ClientViewPoint) {
        this.emitter.emit('view_point', { coord: cdxo.fromCoord(coord), viewPoint: viewPoint});
    }

    private beginMove(intent: Intent, to: Coord) {
        if (this.field == null)
            return;
        if (isNaN(this.coord.distance(to))) // 余りにも遠いのは不可
            return;
        this.path = this.field.pathFinder.find(this.coord, to);
        this.delayMove(intent);
    }

    private delayMove(intent: Intent) {
        if (this.movingTimeoutId != null) // タイムアウトが仕込まれている場合は中断
            return;
        if (this.path.length <= 0)
            return;
        var coord = this.path.shift();
        if (!this.field.move(this, coord)) {
            if (intent === Intent.MOVING
                || this.path.length > 0) {
                this.path = [];
                return;
            }
            switch (intent) {
                case Intent.FLAG: this.field.flag(coord); return;
                case Intent.DIGGING: this.field.dig(coord); break;// 続行
            }
            this.path.push(coord);
        }
        super.emit('moved', this.coord);
        this.movingTimeoutId = setTimeout(() => {
            this.movingTimeoutId = null;
            this.delayMove(intent);
        }, 100);
    }
}

enum Intent {
    MOVING, DIGGING, FLAG
}
