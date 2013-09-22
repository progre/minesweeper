import game = require('./../../framework/game');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');

class PlayerView {
    static resourceFiles = ['/img/remilia.png'];

    displayObject: createjs.BitmapAnimation;

    constructor(private loadQueue: createjs.LoadQueue, private model: ifs.IPlayer) {
        var spriteSheet = {
            images: [this.loadQueue.getResult('/img/remilia.png')],
            frames: { width: 32, height: 32 },
            animations: {
                'walk': { frames: [0, 1, 2, 1], frequency: 6 }
            }
        };
        var ss = new createjs.SpriteSheet(spriteSheet);
        this.displayObject = new createjs.BitmapAnimation(ss);
        this.displayObject.gotoAndPlay('walk');
    }

    update(center: Coord) {
        center.subtract(this.model.coord)
    }
}

export = MineWorldView;
class MineWorldView {
    static resourceFiles = PlayerView.resourceFiles;

    private templateBlock: createjs.Bitmap;
    private background = new createjs.Container();
    displayObject = new createjs.Container();

    constructor(private loadQueue: createjs.LoadQueue) {
        this.templateBlock = new createjs.Bitmap(<any>loadQueue.getResult('/img/block.png'));
        this.displayObject.addChild(this.background);
    }

    set size(value: game.Rect) {
        this.background.removeAllChildren();
        // ブロック一つは32px
        for (var y = -value.height / 32 / 2; y < value.height / 32 / 2; y++) {
            for (var x = -value.width / 32 / 2; x < value.width / 32 / 2; x++) {
                var block = this.templateBlock.clone();
                block.x = x * 32;
                block.y = y * 32;
                this.background.addChild(block);
            }
        }
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
