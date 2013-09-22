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
        var xCount = value.width / 32 | 0;
        if (xCount % 2 === 0) {
            xCount++;
        }
        xCount += 2;
        var yCount = value.height / 32 | 0;
        if (yCount % 2 === 0) {
            yCount++;
        }
        yCount += 2;
        var left = -(xCount >> 1) * 32 - 16;
        var top = -(yCount >> 1) * 32 - 16;
        for (var y = 0; y < yCount; y++) {
            for (var x = 0; x < xCount; x++) {
                var block = this.templateBlock.clone();
                block.x = left + x * 32;
                block.y = top + y * 32;
                this.background.addChild(block);
            }
        }
        this.background.cache(left, top, xCount * 32, yCount * 32);
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
