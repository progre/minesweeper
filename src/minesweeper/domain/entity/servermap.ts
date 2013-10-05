import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');

export = ServerMap;
class ServerMap extends MapBase {
    /** override */
    /** @protected */
    requestViewPointChunk(coord: Coord) {
        // DBに取りに行ったり
        (callback => callback(null))((chunk: vp.ViewPoint[][]) => {
            if (chunk == null) {
                chunk = createViewPointChunk();
                // DBに書き込む？
            }
            this.viewPointChunks.putByCoord(coord, chunk);
            super.emit('chunk', { coord: coord, chunk: chunk });
        });
    }
}

/** 16x16の地形を作成する */
function createViewPointChunk(): vp.ViewPoint[][] {
    var chunk = [];
    for (var y = 0; y < 16; y++) {
        var line = [];
        for (var x = 0; x < 16; x++) {
            line.push(new vp.ViewPoint(
                Math.random() < 0.4 ? vp.Landform.BOMB : vp.Landform.NONE,
                vp.Status.CLOSE));
        }
        chunk.push(line);
    }
    return chunk;
}
