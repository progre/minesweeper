var log4js = require('log4js');
import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import MultiMap = require('./multimap');
import Player = require('./player');

var logger = log4js.getLogger();

export = Landform;
class Landform extends MapBase {
    private players = new CoordMultiMap();

    join(coord: Coord, player: Player) {
        logger.debug('player join to: ' + coord.toString());
        this.players.put(coord, player);
        player.putChunk(coord, this.getViewPointChunk(coord));
    }

    defect(coord: Coord, player: Player) {
        logger.debug('player defect from: ' + coord.toString());
        this.players.removeValueAll(player);
    }

    defectAll(player: Player) {
        logger.debug('player defect all.');
        this.players.removeValueAll(player);
    }

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

class CoordMultiMap extends MultiMap<Coord, Player> {
    /** @protected */
    createKey(key: Coord): string {
        return key.toString();
    }
}
