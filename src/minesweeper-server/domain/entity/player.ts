var log4js = require('log4js');
import ee2 = require('eventemitter2');
import Enumerable = require('./../../../lib/linq');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import PlayerBase = require('./../../../minesweeper-common/domain/entity/playerbase');
import enums = require('./../../../minesweeper-common/domain/valueobject/enums');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import ifs = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import Landform = require('./landform');

var logger = log4js.getLogger();

var firstTime = true;

export = Player;
class Player extends PlayerBase {
    private events: { event: string; listener: Function }[] = [];

    static create() {
        var image = Enumerable.from([
            'hiyoko',
            'hiyoko_lady',
            'mecha_hiyoko',
            'niwatori',
            'waru_hiyoko']).shuffle().first();
        if (firstTime) {
            firstTime = false;
            image = 'remilia';
        }
        return new Player(Coord.of('0', '0'), image, null);
    }

    constructor(
        coord: Coord,
        /**
         hiyoko, hiyoko_lady, mecha_hiyoko, niwatori, waru_hiyoko, remilia
         */
        image: string,
        /** 受信用 */
        private emitter: EventEmitter) {

        super(coord, image);
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
            this.beginMove(enums.Intent.MOVING, cdxo.toCoord(coord));
        });
        this.defineEvent('dig', (coord: ifs.ICoordDTO) => {
            this.beginMove(enums.Intent.DIGGING, cdxo.toCoord(coord));
        });
        this.defineEvent('flag', (coord: ifs.ICoordDTO) => {
            this.beginMove(enums.Intent.FLAG, cdxo.toCoord(coord));
        });
        this.defineEvent('question', (coord: ifs.ICoordDTO) => {
            this.beginMove(enums.Intent.QUESTION, cdxo.toCoord(coord));
        });
        this.defineEvent('remove_question', (coord: ifs.ICoordDTO) => {
            this.beginMove(enums.Intent.REMOVE_QUESTION, cdxo.toCoord(coord));
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

    notifyChunk(coord: Coord, chunk: Chunk<ClientTile>) {
        this.emitter.emit('chunk', { coord: cdxo.fromCoord(coord), chunk: chunk.items });
    }

    notifyTile(coord: Coord, tile: ClientTile) {
        this.emitter.emit('tile', { coord: cdxo.fromCoord(coord), tile: tile });
    }

    notifyExploded(coord: Coord) {
        this.emitter.emit('exploded', cdxo.fromCoord(coord));
    }
}
