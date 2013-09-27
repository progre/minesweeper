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
        this.setCenter(model.coord);
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

    move(id: number, coord: Coord) {
        this.items[id].move(coord);
    }

    addPlayer(id: number, value: ifs.IPlayer) {
        if (this.items[id] != null)
            return;
        var playerView = new PlayerView(this.loadQueue, value);
        this.displayObject.addChild(playerView.displayObject);
        this.items[id] = playerView;
    }

    removePlayer(id: number) {
        var playerView = this.items[id];
        this.displayObject.removeChild(playerView.displayObject);
        delete this.items[id];
    }

    setModel(value: { [key: number]: ifs.IPlayer }) {
        // players‚É“ü‚Á‚Ä‚é‚â‚Â‚ð•\Ž¦
        Enumerable.from(value).forEach(x => {
            this.addPlayer(x.key, x.value);
        });
    }

    setCenter(value: Coord) {
        Enumerable.from(this.items).forEach(x => {
            x.value.setCenter(value);
        });
    }
}
