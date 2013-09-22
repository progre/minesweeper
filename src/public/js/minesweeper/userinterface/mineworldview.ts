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
        this.displayObject.gotoAndPlay('walk');
    }

    set center(value: Coord) {
        var coord = this.model.coord.subtract(value);
        this.displayObject.x = coord.x * 32 - 16;
        this.displayObject.y = coord.y * 32 - 24;
    }
}

class PlayersView {
    static resourceFiles = PlayerView.resourceFiles;

    displayObject = new createjs.Container();
    private items: PlayerView[] = [];

    constructor(
        private loadQueue: createjs.LoadQueue) {
    }

    set model(value: ifs.IHash<ifs.IPlayer>) {
        // playersに入ってるやつを表示
        Enumerable.from(value).forEach((x: { key: string; value: ifs.IPlayer }) => {
            var playerView = new PlayerView(this.loadQueue, x.value);
            this.displayObject.addChild(playerView.displayObject);
            this.items.push(playerView);
        });
    }

    set center(value: Coord) {
        this.items.forEach(player => {
            player.center = value;
        });
    }
}

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
    static resourceFiles = PlayerView.resourceFiles;

    displayObject = new createjs.Container();
    private blocksView: BlocksView;
    private playersView: PlayersView;
    private _size = new game.Rect(0, 0);
    private _center = Coord.of('0', '0');

    constructor(private loadQueue: createjs.LoadQueue) {
        super();
        this.blocksView = new BlocksView(loadQueue);
        this.displayObject.addChild(this.blocksView.backDisplayObject);
        this.playersView = new PlayersView(loadQueue);
        this.displayObject.addChild(this.playersView.displayObject);

        this.displayObject.addEventListener('click', (eventObj: any) => {
            var col = eventObj.stageX - (this._size.width >> 1);
            var row = eventObj.stageY - (this._size.height >> 1);
            super.emit('click', {
                coord: Coord.fromNumber(col, row).subtract(this._center),
                type: eventObj.nativeEvent.button
            });
        });
    }

    set size(value: game.Rect) {
        this._size = value;
        this.blocksView.size = value;
    }

    set model(model: ifs.IMineWorld) {
        this.playersView.model = model.players;
        this.center = model.players[model.yourId].coord;
    }

    set center(value: Coord) {
        this.playersView.center = value;
    }

    private moveCenter(x: number, y: number) {
    }
}
