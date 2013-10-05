import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');

export = ServerMap;
class ServerMap extends MapBase {
    /** override */
    /** @protected */
    requestViewPointChunk(coord: Coord) {
        // DB�Ɏ��ɍs������
        (callback => callback(null))((chunk: vp.ViewPoint[][]) => {
            if (chunk == null) {
                chunk = createViewPointChunk();
                // DB�ɏ������ށH
            }
            this.viewPointChunks.putByCoord(coord, chunk);
            super.emit('chunk', { coord: coord, chunk: chunk });
        });
    }
}

/** 16x16�̒n�`���쐬���� */
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
