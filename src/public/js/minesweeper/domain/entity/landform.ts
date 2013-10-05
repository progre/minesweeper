import ee2 = require('eventemitter2');
import Enumerable = require('./../../../lib/linq');
import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');

export = Landform;

class Landform extends MapBase {
    private emitter: ee2.EventEmitter2;

    setEmitter(emitter: ee2.EventEmitter2) {
        this.emitter = emitter;
    }

    requestViewPointChunk(coord: Coord): void {
        if (this.emitter != null)
            this.emitter.emit('join_chunk', cdxo.fromCoord(coord));
    }
}

function createUnknownPlace(): vp.ViewPoint[][] {
    return Enumerable.generate(() =>
        Enumerable.generate(() =>
            new vp.ViewPoint(vp.Landform.UNKNOWN, vp.Status.UNKNOWN),
            16).toArray(),
        16).toArray();
}
