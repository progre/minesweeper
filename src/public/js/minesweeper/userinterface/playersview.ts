import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');
import Camera = require('./../domain/entity/camera');

class PlayerView {
    static resourceFiles = ['/img/remilia.png'];

    displayObject: createjs.BitmapAnimation;

    constructor(private loadQueue: createjs.LoadQueue, private model: ifs.IPlayer, private camera: Camera) {
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

        this.updatePosition();
        camera.on('moved', () => {
            this.updatePosition();
        });
    }

    move(coord: Coord) {
        this.model.coord = coord;
        this.updatePosition();
    }

    private updatePosition() {
        var pos = this.camera.fromAbsoluteToDisplay(this.model.coord);
        this.displayObject.x = pos.x;
        this.displayObject.y = pos.y - 8;
    }
}

export = PlayersView;
class PlayersView {
    static resourceFiles = PlayerView.resourceFiles;

    displayObject = new createjs.Container();
    private items: ifs.IHash<PlayerView> = {};
    private center: Coord;

    constructor(
        private loadQueue: createjs.LoadQueue,
        private camera: Camera) {
    }

    move(id: number, coord: Coord) {
        this.items[id].move(coord);
    }

    addPlayer(id: number, value: ifs.IPlayer) {
        if (this.items[id] != null)
            return;
        var playerView = new PlayerView(this.loadQueue, value, this.camera);
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
}
