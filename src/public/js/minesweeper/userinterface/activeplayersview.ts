import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');
import ActivePlayers = require('./../domain/entity/activeplayers');
import Camera = require('./entity/camera');

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

    updatePosition() {
        console.log(this.model.coord.xString, this.model.coord.yString);
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

    constructor(private loadQueue: createjs.LoadQueue, private camera: Camera, private activePlayers: ActivePlayers) {
        activePlayers.on('player_moved', (id: number) => {
            this.items[id].updatePosition();
        });
        activePlayers.on('player_added', (obj: { id: number; player: ifs.IPlayer }) => {
            var playerView = new PlayerView(this.loadQueue, obj.player, this.camera);
            this.displayObject.addChild(playerView.displayObject);
            this.items[obj.id] = playerView;
        });
        activePlayers.on('player_removed', (id: number) => {
            this.displayObject.removeChild(this.items[id].displayObject);
            delete this.items[id];
        });
    }
}
