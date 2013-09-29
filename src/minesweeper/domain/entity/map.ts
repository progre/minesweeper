import BigInteger = require('jsbn');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import vp = require('./../../../minesweeper-common/domain/valueobject/viewpoint');

export = Map;
class Map {
    // 地雷（地形）Map 普通の爆弾、☢、Bakuhigashi等
    // 解放状況(close, flag, open)

    private viewPointChunks = new Chunks<vp.ViewPoint>({
        get: (key: string): vp.ViewPoint[][]=> { return null; },
        put: (key: string, chunk: vp.ViewPoint[][]) => { }
    }, createViewPointChunk);

    getViewPoint(coord: Coord) {
        return this.viewPointChunks.get(coord);
    }

    getViewPointChunk(coord: Coord) {
        return this.viewPointChunks.getChunk(coord);
    }

    getViewPointChunkFromGlobal(coord:Coord) {
        return this.viewPointChunks.getChunkFromGlobal(coord);
    }

    getNumber(coord: Coord) {
    }
}


class Chunks<T> {
    private cache: { [key: string]: { touch: Date; data: T[][] } } = {};

    constructor(
        private repository: { get: (key: string) => T[][]; put: (key: string, chunk: T[][]) => void },
        private factory: () => T[][]) {
    }

    getChunk(coord: Coord) {
        var key = this.createKey(coord.x, coord.y);
        return this.getChunkFromKey(key).data;
    }

    getChunkFromGlobal(coord: Coord) {
        var key = this.createKey(coord.x.shiftRight(4), coord.y.shiftRight(4));
        return this.getChunkFromKey(key).data;
    }

    // example: 0-15 -> 0,  16-31 -> 2 -1--16 -> -1
    get(coord: Coord) {
        var chunk = this.getChunkFromGlobal(coord);
        var y = coord.y.and(new BigInteger('15')).intValue();
        var x = coord.x.and(new BigInteger('15')).intValue();
        return chunk[y][x];
    }

    private createKey(x: BigInteger, y: BigInteger) {
        return x.toString() + ',' + y.toString();
    }

    private getChunkFromKey(key: string) {
        var chunk = this.cache[key];
        if (chunk != null)
            return chunk;
        // リポジトリから取得
        var chunkData = this.repository.get(key);
        if (chunkData == null) {
            // 生成してリポジトリに書き込み
            chunkData = this.factory();
            this.repository.put(key, chunkData);
        }
        // キャッシュイン
        this.cache[key] = chunk = { touch: new Date(), data: chunkData };
        return chunk;
    }
}

/** 16x16の地形を作成する */
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
