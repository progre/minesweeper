import game = require('./../../framework/game');
import ClientMap = require('./../domain/entity/clientmap');

export = BlocksView;
class BlocksView {
    static resourceFiles = ['/img/block.png'];

    backDisplayObject = new createjs.Container();
    private templateBlock: createjs.BitmapAnimation;

    constructor(private loadQueue: createjs.LoadQueue, private map: ClientMap) {
        this.templateBlock = this.createTemplate(loadQueue);
        this.templateBlock.gotoAndPlay('open');
    }

    setSize(value: game.Rect) {
        this.backDisplayObject.removeAllChildren();
        this.backDisplayObject.uncache();

        // ƒuƒƒbƒNˆê‚Â‚Í32px
        var colCount = value.width / 32 | 0;
        if (colCount % 2 === 0) {
            colCount++;
        }
        colCount += 2;
        var rowCount = value.height / 32 | 0;
        if (rowCount % 2 === 0) {
            rowCount++;
        }
        rowCount += 2;
        var left = -(colCount >> 1) * 32 - 16;
        var top = -(rowCount >> 1) * 32 - 16;
        for (var row = 0; row < rowCount; row++) {
            for (var col = 0; col < colCount; col++) {
                var block = this.templateBlock.clone();
                block.x = left + col * 32;
                block.y = top + row * 32;
                this.backDisplayObject.addChild(block);
            }
        }
        this.backDisplayObject.cache(left, top, colCount * 32, rowCount * 32);
    }

    private createTemplate(loadQueue: createjs.LoadQueue) {
        var ssOpt = {
            images: [loadQueue.getResult('/img/block.png')],
            frames: { width: 32, height: 32 },
            animations: {
                'open': [1],
                'close': [0]
            }
        };
        var ss = new createjs.SpriteSheet(ssOpt);
        return new createjs.BitmapAnimation(ss);
    }
}
