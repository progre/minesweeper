import game = require('./../../framework/game');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');

class PlayerView {
    static resourceFiles = ['/img/remilia.png'];

    displayObject: createjs.BitmapAnimation;

    constructor(private loadQueue: createjs.LoadQueue, private model: ifs.IPlayer) {
        var ssOpt = {
            images: [this.loadQueue.getResult('/img/remilia.png')],
            frames: { width: 32, height: 32 },
            animations: {
                'walk': { frames: [0, 1, 2, 1], frequency: 6 }
            }
        };
        var ss = new createjs.SpriteSheet(ssOpt);
        this.displayObject = new createjs.BitmapAnimation(ss);
        this.displayObject.x = -16;
        this.displayObject.y = -24;
        this.displayObject.gotoAndPlay('walk');
    }

    update(center: Coord) {
        center.subtract(this.model.coord)
    }
}

export = MineWorldView;
class MineWorldView {
    static resourceFiles = PlayerView.resourceFiles;

    private templateBlock: createjs.BitmapAnimation;
    private background = new createjs.Container();
    displayObject = new createjs.Container();

    constructor(private loadQueue: createjs.LoadQueue) {
        var ssOpt = {
            images: [this.loadQueue.getResult('/img/block.png')],
            frames: { width: 32, height: 32 },
            animations: {
                'open': [1],
                'close': [0]
            }
        };
        var ss = new createjs.SpriteSheet(ssOpt);
        this.templateBlock = new createjs.BitmapAnimation(ss);
        this.templateBlock.gotoAndPlay('open');
        this.displayObject.addChild(this.background);
    }

    set size(value: game.Rect) {
        this.background.removeAllChildren();
        this.background.uncache();

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
                this.background.addChild(block);
            }
        }
        this.background.cache(left, top, colCount * 32, rowCount * 32);
        this.background.addEventListener('click', (eventObj: any) => {
            var x = eventObj.stageX - (value.width >> 1);
            var y = eventObj.stageY - (value.height >> 1);
            console.log(Math.round(x / 32), Math.round(y / 32));
        });
    }

    setModel(model: ifs.IMineWorld) {
        // playersに入ってるやつを表示
        Enumerable.from(model.players).forEach((x: { key: string; value: any }) => {
            var playerView = new PlayerView(this.loadQueue, x.value);
            this.displayObject.addChild(playerView.displayObject);
        });
        this.center = model.players[model.yourId].coord;
    }

    private set center(value: Coord) {

    }

    private moveCenter(x: number, y: number) {
    }
}
