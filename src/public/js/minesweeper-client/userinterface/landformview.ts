import game = require('./../../framework/game');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ClientTile = require('./../../minesweeper-common/domain/valueobject/clienttile');
import Landform = require('./../domain/entity/landform');
import Camera = require('./entity/camera');
import dos = require('./displayobjects');
import TileView = require('./tileview');

export = LandformView;
class LandformView {
    static resourceFiles = ['/img/block.png', '/img/numbers.png', '/img/explosion3.png', '/img/layers.png'];

    backDisplayObject = new createjs.Container();
    frontDisplayObject = new createjs.Container();
    layer = new createjs.Container();
    cachelessLayer = new createjs.Container();
    private baseTemplate: createjs.Sprite;
    private lowLayerTemplate: createjs.Sprite;
    private highLayerTemplate: createjs.Sprite;
    private explosionTemplate: createjs.Sprite;
    private tiles: TileView[][] = [[]];
    /** åªç›ÇÃï`âÊóÃàÊ */
    private rect: game.Rect;

    constructor(private loadQueue: createjs.LoadQueue, private landform: Landform, private camera: Camera) {
        this.backDisplayObject.mouseEnabled = false;
        this.frontDisplayObject.mouseEnabled = false;
        this.baseTemplate = dos.createBaseTemplate(loadQueue);
        this.lowLayerTemplate = dos.createLowLayerTemplate(loadQueue);
        this.highLayerTemplate = dos.createHighLayerTemplate(loadQueue);
        this.explosionTemplate = dos.createExplosionTemplate(loadQueue);
        this.frontDisplayObject.addChild(this.layer);
        this.frontDisplayObject.addChild(this.cachelessLayer);
        landform.on('chunk_updated', (coord: Coord) => {
            this.refreshBlocks();
        });
        landform.on('view_point_updated', (coord: Coord) => {
            this.updateBlocks();
        });
        landform.on('exploded', (coord: Coord) => {
            var exp = this.explosionTemplate.clone();
            this.cachelessLayer.addChild(exp);
            var absCoord = this.camera.fromAbsoluteToDisplay(coord);
            exp.x = absCoord.x + 8 - 108;
            exp.y = absCoord.y + 8 - 108;
            exp.on('animationend', () => this.cachelessLayer.removeChild(exp));
        });
    }

    setSize(value: game.Rect) {
        this.rect = value;
        this.refreshBlocks();
    }

    refreshBlocks() {
        this.backDisplayObject.removeAllChildren();
        this.layer.removeAllChildren();

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
        this.tiles = [];
        for (var row = 0; row < rowCount; row++) {
            var tileLine: TileView[] = [];
            for (var col = 0; col < colCount; col++) {
                var base = this.baseTemplate.clone();
                this.backDisplayObject.addChild(base);
                var lowLayer = this.lowLayerTemplate.clone();
                this.backDisplayObject.addChild(lowLayer);
                var highLayer = this.highLayerTemplate.clone();
                this.layer.addChild(highLayer);
                tileLine.push(new TileView(base, lowLayer, highLayer));
            }
            this.tiles.push(tileLine);
        }
        this.updateBlocks();
    }

    updateBlocks() {
        if (this.tiles == null || this.tiles.length <= 0)
            return;
        var rows = this.tiles.length;
        var rowCenter = rows >> 1;
        var cols = this.tiles[0].length;
        var colCenter = cols >> 1;
        var top = -(rows >> 1) * 32 - 16;
        var left = -(cols >> 1) * 32 - 16;
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                var tile = this.tiles[row][col];
                tile.setPos(left + col * 32, top + row * 32);
                var model: ClientTile = this.landform.getTile(
                    this.camera.fromRelativeToAbsolute(
                        col - colCenter,
                        row - rowCenter));
                tile.update(model);
            }
        }
        this.backDisplayObject.cache(left, top, cols * 32, rows * 32);
        this.layer.cache(left, top, cols * 32, rows * 32);
    }
}

