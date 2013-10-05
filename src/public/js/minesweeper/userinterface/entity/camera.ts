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

    /** �����W���\�����W */
    fromAbsoluteToRelative(target: Coord) {
        return target.subtract(this.center);
    }

    /** �����W���\���`����W */
    fromAbsoluteToDisplay(target: Coord) {
        var relative = this.fromAbsoluteToRelative(target);
        return {
            x: relative.xIntValue * 32 - 16,
            y: relative.yIntValue * 32 - 16
        };
    }

    /** �\���`����W���\�����W */
    private fromDisplayToRelative(x: number, y: number) {
        return {
            x: Math.round(x / 32),
            y: Math.round(y / 32)
        };
    }
    /** �\���`����W(���S��0)�������W */
    fromDisplayToAbsolute(x: number, y: number) {
        var pos = this.fromDisplayToRelative(x, y);
        return Coord.fromNumber(pos.x, pos.y).add(this.center);
    }
}