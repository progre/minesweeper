import game = require('./../../framework/game');
import vp = require('./../../minesweeper-common/domain/valueobject/viewpoint');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import Landform = require('./../domain/entity/landform');
import Camera = require('./entity/camera');

export = LandformView;
class LandformView {
    static resourceFiles = ['/img/block.png'];

    backDisplayObject = new createjs.Container();
    private templateBlock: createjs.BitmapAnimation;
    private blocks: createjs.BitmapAnimation[][] = [[]];
    /** åªç›ÇÃï`âÊóÃàÊ */
    private rect: game.Rect;

    constructor(private loadQueue: createjs.LoadQueue, private landform: Landform, private camera: Camera) {
        this.templateBlock = this.createTemplate(loadQueue);
        this.templateBlock.gotoAndPlay('unknown');
        landform.on('chunk_updated', (coord: Coord) => {
            this.refreshBlocks();
        });
    }

    setSize(value: game.Rect) {
        this.rect = value;
        this.refreshBlocks();
    }

    refreshBlocks() {
        this.backDisplayObject.removeAllChildren();
        this.backDisplayObject.uncache();

        // ÉuÉçÉbÉNàÍÇ¬ÇÕ32px
        var colCount = this.rect.width / 32 | 0;
        if (colCount % 2 === 0) {
            colCount++;
        }
        colCount += 2;
        var rowCount = this.rect.height / 32 | 0;
        if (rowCount % 2 === 0) {
            rowCount++;
        }
        rowCount += 2;
        this.blocks = [];
        for (var row = 0; row < rowCount; row++) {
            var line: createjs.BitmapAnimation[] = [];
            for (var col = 0; col < colCount; col++) {
                var block = this.templateBlock.clone();
                line.push(block);
                this.backDisplayObject.addChild(block);
            }
            this.blocks.push(line);
        }
        this.updateBlocks();
        var left = -(colCount >> 1) * 32 - 16;
        var top = -(rowCount >> 1) * 32 - 16;
        this.backDisplayObject.cache(left, top, colCount * 32, rowCount * 32);
    }

    private updateBlocks() {
        if (this.blocks == null || this.blocks.length <= 0)
            return;
        var rows = this.blocks.length;
        var rowCenter = rows >> 1;
        var cols = this.blocks[0].length;
        var colCenter = cols >> 1;
        var top = -(rows >> 1) * 32 - 16;
        var left = -(cols >> 1) * 32 - 16;
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                var block = this.blocks[row][col];
                block.x = left + col * 32;
                block.y = top + row * 32;
                switch (this.landform.getViewPoint(this.camera.fromRelativeToAbsolute(col - colCenter, row - rowCenter)).status) {
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
