import game = require('./../../framework/game');
import enums = require('./../../minesweeper-common/domain/valueobject/enums');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../minesweeper-common/domain/valueobject/clienttile');
import Landform = require('./../domain/entity/landform');
import Camera = require('./entity/camera');

export = LandformView;
class LandformView {
    static resourceFiles = ['/img/block.png', '/img/numbers.png'];

    backDisplayObject = new createjs.Container();
    frontDisplayObject = new createjs.Container();
    private templateBlock: createjs.BitmapAnimation;
    private templateLabel: createjs.BitmapAnimation;
    private blocks: createjs.BitmapAnimation[][] = [[]];
    private labels: createjs.BitmapAnimation[][] = [[]];
    /** åªç›ÇÃï`âÊóÃàÊ */
    private rect: game.Rect;

    constructor(private loadQueue: createjs.LoadQueue, private landform: Landform, private camera: Camera) {
        this.templateBlock = createTemplateBlock(loadQueue);
        this.templateLabel = createTemplateLabel(loadQueue);
        landform.on('chunk_updated', (coord: Coord) => {
            this.updateBlocks();
        });
        landform.on('view_point_updated', (coord: Coord) => {
            this.updateBlocks();
        });
    }

    setSize(value: game.Rect) {
        this.rect = value;
        this.refreshBlocks();
    }

    refreshBlocks() {
        this.backDisplayObject.removeAllChildren();
        this.frontDisplayObject.removeAllChildren();

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
        this.labels = [];
        for (var row = 0; row < rowCount; row++) {
            var blockLine: createjs.BitmapAnimation[] = [];
            var labelLine: createjs.BitmapAnimation[] = [];
            for (var col = 0; col < colCount; col++) {
                var block = this.templateBlock.clone();
                blockLine.push(block);
                this.backDisplayObject.addChild(block);
                var label = this.templateLabel.clone();
                labelLine.push(label);
                this.frontDisplayObject.addChild(label);
            }
            this.blocks.push(blockLine);
            this.labels.push(labelLine);
        }
        this.updateBlocks();
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
                var label = this.labels[row][col];
                label.x = left + col * 32;
                label.y = top + row * 32;
                var tile = this.landform.getViewPoint(
                    this.camera.fromRelativeToAbsolute(
                        col - colCenter,
                        row - rowCenter));
                updateBlock(block, label, tile);
            }
        }
        console.log('block updated.');
        this.backDisplayObject.cache(left, top, cols * 32, rows * 32);
        this.frontDisplayObject.cache(left, top, cols * 32, rows * 32);
    }
}

function updateBlock(block: createjs.BitmapAnimation, label: createjs.BitmapAnimation, tile: ClientTile) {
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

function createTemplateBlock(loadQueue: createjs.LoadQueue) {
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

function createTemplateLabel(loadQueue: createjs.LoadQueue) {
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
