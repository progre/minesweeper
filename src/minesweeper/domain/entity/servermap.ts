import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');

export = ServerMap;
class ServerMap extends MapBase {
    constructor() {
        super(key => {
            var chunk = getFromRepository(key);
            if (chunk == null) {
                // �������ă��|�W�g���ɏ�������
                chunk = createViewPointChunk();
                putToRepository(key, chunk);
            }
            return chunk;
        });
    }
}

function getFromRepository(key: string) {
    return null;
}

function putToRepository(key: string, value: any) {
}

/** 16x16�̒n�`���쐬���� */
function createViewPointChunk(): vp.ViewPoint[][] {
    var chunk = [];
    for (var y = 0; y < 16; y++) {
        var line = [];
        for (var x = 0; x < 16; x++) {
            line.push(new vp.ViewPoint(
                Math.random() < 0.4 ? vp.Landform.Bomb : vp.Landform.None,
                vp.Status.Close));
        }
        chunk.push(line);
    }
    return chunk;
}
