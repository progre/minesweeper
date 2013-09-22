import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');

class PlayerView {
    static resourceFiles = ['/img/remilia.png'];

    displayObject: createjs.BitmapAnimation;
    private coord = Coord.of('0', '0');
    private center = Coord.of('0', '0');

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

    setCenter(value: Coord) {
        this.center = value;
        this.updatePosition();
    }

    move(coord: Coord) {
        this.coord = coord;
        this.updatePosition();
    }

    private updatePosition() {
        var fixed = this.coord.subtract(this.center);
        this.displayObject.x = fixed.xJSValue * 32 - 16;
        this.displayObject.y = fixed.yJSValue * 32 - 24;
    }
}

export = PlayersView;
class PlayersView {
    static resourceFiles = PlayerView.resourceFiles;

    displayObject = new createjs.Container();
    private items: ifs.IHash<PlayerView> = {};

    constructor(
        private loadQueue: createjs.LoadQueue) {
    }

    move(id: string, coord: Coord) {
        this.items[id].move(coord);
    }

    set model(value: ifs.IHash<ifs.IPlayer>) {
        // players‚É“ü‚Á‚Ä‚é‚â‚Â‚ð•\Ž¦
        Enumerable.from(value).forEach((x: { key: string; value: ifs.IPlayer }) => {
            var playerView = new PlayerView(this.loadQueue, x.value);
            this.displayObject.addChild(playerView.displayObject);
            this.items[x.key] = playerView;
        });
    }

    set center(value: Coord) {
        Enumerable.from(this.items).forEach((x: { key: string; value: PlayerView }) => {
            x.value.setCenter(value);
        });
    }
}
