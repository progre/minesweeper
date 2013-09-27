import game = require('./../../framework/game');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');
import PlayersView = require('./playersview');

class BlocksView {
    static resourceFiles = ['/img/block.png'];

    backDisplayObject = new createjs.Container();
    private templateBlock: createjs.BitmapAnimation;

    constructor(private loadQueue: createjs.LoadQueue) {
        this.templateBlock = this.createTemplate(loadQueue);
        this.templateBlock.gotoAndPlay('open');
    }

    set size(value: game.Rect) {
        this.backDisplayObject.removeAllChildren();
        this.backDisplayObject.uncache();

        // ブロック一つは32px
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

export = MineWorldView;
class MineWorldView extends EventEmitter2 {
    static resourceFiles = PlayersView.resourceFiles;

    displayObject = new createjs.Container();
    private clickObject = createWall();
    private blocks: BlocksView;
    activePlayers: PlayersView;
    private size = new game.Rect(0, 0);
    /** row-col座標系 */
    private center = Coord.of('0', '0');

    constructor(private loadQueue: createjs.LoadQueue) {
        super();
        this.displayObject.addChild(this.clickObject);
        this.blocks = new BlocksView(loadQueue);
        this.displayObject.addChild(this.blocks.backDisplayObject);
        this.activePlayers = new PlayersView(loadQueue);
        this.displayObject.addChild(this.activePlayers.displayObject);

        this.clickObject.addEventListener('click', (eventObj: any) => {
            var col = Math.round((eventObj.stageX - (this.size.width >> 1)) / 32);
            var row = Math.round((eventObj.stageY - (this.size.height >> 1)) / 32);
            super.emit('click', {
                coord: Coord.fromNumber(col, row).add(this.center),
                type: eventObj.nativeEvent.button
            });
        });
    }

    setSize(value: game.Rect) {
        this.size = value;
        this.blocks.size = value;
    }

    setModel(model: ifs.IMineWorld) {
        this.activePlayers.setModel(model.players);
        this.setCenter(model.players[model.yourId].coord);
    }

    private setCenter(value: Coord) {
        this.center = value;
        this.activePlayers.setCenter(value);
    }

    private moveCenter(x: number, y: number) {
    }
}

function createWall() {
    var wall = new createjs.Shape();
    wall.graphics.beginFill('#000').drawRect(0, 0, 65535, 65535);
    wall.x = -65535 / 2;
    wall.y = -65535 / 2;
    return wall;
}
