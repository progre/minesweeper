import game = require('./../../framework/game');
import vp = require('./../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import Landform = require('./../domain/entity/landform');
import Camera = require('./entity/camera');

export = LandformView;
class LandformView {
    static resourceFiles = ['/img/block.png'];

    private rect: game.Rect;

    backDisplayObject = new createjs.Container();
    private templateBlock: createjs.BitmapAnimation;

    constructor(private loadQueue: createjs.LoadQueue, private landform: Landform, private camera: Camera) {
        this.templateBlock = this.createTemplate(loadQueue);
        this.templateBlock.gotoAndPlay('unknown');
        landform.on('chunk_updated', (coord: Coord) => {
            //this.setSize(this.rect);
        });
    }

    setSize(value: game.Rect) {
        this.rect = value;
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
                switch (this.landform.getViewPoint(this.camera.fromRelativeToAbsolute(col, row)).status) {
                    case vp.Status.UNKNOWN:
                        block.gotoAndPlay('unknown');
                        break;
                    case vp.Status.CLOSE:
                        block.gotoAndPlay('close');
                        break;
                    case vp.Status.OPEN:
                        block.gotoAndPlay('open');
                        break;
                }
            }
        }
        this.backDisplayObject.cache(left, top, colCount * 32, rowCount * 32);
    }

    private createTemplate(loadQueue: createjs.LoadQueue) {
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
        return new createjs.BitmapAnimation(ss);
    }
}
