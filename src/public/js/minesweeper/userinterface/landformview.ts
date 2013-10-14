import game = require('./../../framework/game');
import enums = require('./../../minesweeper-common/domain/valueobject/enums');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import Landform = require('./../domain/entity/landform');
import Camera = require('./entity/camera');
import dos = require('./displayobjects');

export = LandformView;
class LandformView {
    static resourceFiles = ['/img/block.png', '/img/numbers.png', '/img/explosion3.png'];

    backDisplayObject = new createjs.Container();
    frontDisplayObject = new createjs.Container();
    topLayer = new createjs.Container();
    rearLayer = new createjs.Container();
    private templateBlock: createjs.BitmapAnimation;
    private templateLabel: createjs.BitmapAnimation;
    private templateExplosion: createjs.BitmapAnimation;
    private blocks: createjs.BitmapAnimation[][] = [[]];
    private labels: createjs.BitmapAnimation[][] = [[]];
    /** åªç›ÇÃï`âÊóÃàÊ */
    private rect: game.Rect;

    constructor(private loadQueue: createjs.LoadQueue, private landform: Landform, private camera: Camera) {
        this.templateBlock = dos.createTemplateBlock(loadQueue);
        this.templateLabel = dos.createTemplateLabel(loadQueue);
        this.templateExplosion = dos.createTemplateExplosion(loadQueue);
        this.frontDisplayObject.addChild(this.rearLayer);
        this.frontDisplayObject.addChild(this.topLayer);
        landform.on('chunk_updated', (coord: Coord) => {
            this.updateBlocks();
        });
        landform.on('view_point_updated', (coord: Coord) => {
            this.updateBlocks();
        });
        landform.on('exploded', (coord: Coord) => {
            var exp = this.templateExplosion.clone();
            this.topLayer.addChild(exp);
            var absCoord = this.camera.fromAbsoluteToDisplay(coord);
            exp.play();
            exp.x = absCoord.x + 8 - 108;
            exp.y = absCoord.y + 8 - 108;
            exp.onAnimationEnd = () => this.topLayer.removeChild(exp);
            exp.compositeOperation = "lighter";
        });
    }

    setSize(value: game.Rect) {
        this.rect = value;
        this.refreshBlocks();
    }

    refreshBlocks() {
        this.backDisplayObject.removeAllChildren();
        this.rearLayer.removeAllChildren();

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
                this.rearLayer.addChild(label);
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
                dos.updateBlock(block, label, tile);
            }
        }
        this.backDisplayObject.cache(left, top, cols * 32, rows * 32);
        this.rearLayer.cache(left, top, cols * 32, rows * 32);
    }
}

