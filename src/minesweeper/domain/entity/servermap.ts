import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');

export = ServerMap;
class ServerMap extends MapBase {
    constructor() {
        super({
            get: (key: string): vp.ViewPoint[][]=> { return null; },
            put: (key: string, chunk: vp.ViewPoint[][]) => { }
        }, createViewPointChunk);
    }
}

/** 16x16‚Ì’nŒ`‚ğì¬‚·‚é */
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
