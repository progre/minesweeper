import enums = require('./../../minesweeper-common/domain/valueobject/enums');
import ClientTile = require('./../../minesweeper-common/domain/valueobject/clienttile');

export function createTemplateBlock(loadQueue: createjs.LoadQueue) {
    var ssOpt = {
        images: [loadQueue.getResult('/img/block.png')],
        frames: { width: 32, height: 32 },
        animations: {
            'unknown': [2],
            'open': [1],
            'close': [0]
        }
    };
    var ss = new createjs.SpriteSheet(ssOpt);
    var block = new createjs.BitmapAnimation(ss);
    block.gotoAndPlay('unknown');
    return block;
}

export function createTemplateLabel(loadQueue: createjs.LoadQueue) {
    var ssOpt = {
        images: [loadQueue.getResult('/img/numbers.png')],
        frames: { width: 32, height: 32 },
        animations: {
            '0': [0],
            '1': [1],
            '2': [2],
            '3': [3],
            '4': [4],
            '5': [5],
            '6': [6],
            '7': [7],
            '8': [8],
            '?': [9],
            'M': [10],
            'F': [11]
        }
    };
    var ss = new createjs.SpriteSheet(ssOpt);
    var block = new createjs.BitmapAnimation(ss);
    block.gotoAndPlay('?');
    block.visible = false;
    block.alpha = 0.75;
    return block;
}

export function createTemplateExplosion(loadQueue: createjs.LoadQueue) {
    var ssOpt = {
        images: [loadQueue.getResult('/img/explosion3.png')],
        frames: { width: 215, height: 215 },
        animations: {
            default: [0, 20, true, 2]
        }
    };
    var ss = new createjs.SpriteSheet(ssOpt);
    var anim = new createjs.BitmapAnimation(ss);
    anim.gotoAndPlay('default');
    return anim;
}

export function updateBlock(block: createjs.BitmapAnimation, label: createjs.BitmapAnimation, tile: ClientTile) {
    switch (tile == null ? enums.Status.UNKNOWN : tile.status) {
        case enums.Status.UNKNOWN:
            block.gotoAndPlay('unknown');
            label.visible = true;
            break;
        case enums.Status.CLOSE:
            block.gotoAndPlay('close');
            label.visible = false;
            break;
        case enums.Status.OPEN:
            block.gotoAndPlay('open');
            label.visible = true;
            break;
    }
    label.gotoAndPlay(
        tile == null || tile.status === enums.Status.UNKNOWN || tile.mines < 0 ? '?'
        : tile.mines >= 9 ? 'M'
        : tile.mines.toString());
}