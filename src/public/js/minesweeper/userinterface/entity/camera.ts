import ee2 = require('eventemitter2');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');

export = Camera;
class Camera extends ee2.EventEmitter2 {
    constructor(
        private center: Coord) {
        super();
    }

    setCenter(center: Coord) {
        this.center = center;
        super.emit('moved', null);
    }

    /** 実座標→表示座標 */
    fromAbsoluteToRelative(target: Coord) {
        return target.subtract(this.center);
    }

    /** 実座標→表示描画座標 */
    fromAbsoluteToDisplay(target: Coord) {
        var relative = this.fromAbsoluteToRelative(target);
        return {
            x: relative.xIntValue * 32 - 16,
            y: relative.yIntValue * 32 - 16
        };
    }

    /** 表示描画座標→表示座標 */
    private fromDisplayToRelative(x: number, y: number) {
        return {
            x: Math.round(x / 32),
            y: Math.round(y / 32)
        };
    }

    /** 表示座標→実座標 */
    fromRelativeToAbsolute(x: number, y: number) {
        return Coord.fromNumber(x, y).add(this.center);
    }

    /** 表示描画座標(中心が0)→実座標 */
    fromDisplayToAbsolute(x: number, y: number) {
        var pos = this.fromDisplayToRelative(x, y);
        return this.fromRelativeToAbsolute(pos.x, pos.y);
    }
}