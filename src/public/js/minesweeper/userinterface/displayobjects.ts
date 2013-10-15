export function createBaseTemplate(loadQueue: createjs.LoadQueue) {
    var ssOpt = {
        images: [loadQueue.getResult('/img/block.png'), loadQueue.getResult('/img/layers.png')],
        frames: { width: 32, height: 32 },
        animations: {
            'unknown': [5],
            'open': [1],
            'close': [0]
        }
    };
    var block = createAnim(ssOpt);
    block.gotoAndStop('unknown');
    return block;
}

export function createHighLayerTemplate(loadQueue: createjs.LoadQueue) {
    var ssOpt = {
        images: [loadQueue.getResult('/img/numbers.png'), loadQueue.getResult('/img/layers.png')],
        frames: { width: 32, height: 32 },
        animations: {
            'unknown': [14],
            '1': [0],
            '2': [1],
            '3': [2],
            '4': [3],
            '5': [4],
            '6': [5],
            '7': [6],
            '8': [7]
        }
    };
    var block = createAnim(ssOpt);
    block.gotoAndStop('unknown');
    block.alpha = 0.75;
    return block;
}

export function createLowLayerTemplate(loadQueue: createjs.LoadQueue) {
    var ssOpt = {
        images: [loadQueue.getResult('/img/layers.png')],
        frames: { width: 32, height: 32 },
        animations: {
            'unknown': [3],
            '?': [1],
            '💣': [2],
            '🚩': [0]
        }
    };
    var block = createAnim(ssOpt);
    block.gotoAndStop('unknown');
    return block;
}

export function createExplosionTemplate(loadQueue: createjs.LoadQueue) {
    var ssOpt = {
        images: [loadQueue.getResult('/img/explosion3.png')],
        frames: { width: 215, height: 215 },
        animations: {
            default: [0, 20, true, 2]
        }
    };
    var anim = createAnim(ssOpt);
    anim.gotoAndPlay('default');
    anim.compositeOperation = "lighter";
    return anim;
}

var createAnim = (ssOpt: any)
    => new createjs.BitmapAnimation(new createjs.SpriteSheet(ssOpt));
