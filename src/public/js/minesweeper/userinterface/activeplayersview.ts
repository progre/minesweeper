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
        var pos = this.camera.fromAbsoluteToDisplay(this.model.coord);
        this.displayObject.x = pos.x;
        this.displayObject.y = pos.y - 8;
    }
}

export = ActivePlayersView;
class ActivePlayersView {
    static resourceFiles = PlayerView.resourceFiles;

    displayObject = new createjs.Container();
    private items: ifs.IHash<PlayerView> = {};
    private center: Coord;

    constructor(private loadQueue: createjs.LoadQueue, private camera: Camera, private activePlayers: ActivePlayers) {
        activePlayers.on('player_moved', (obj: { id: number; coord: Coord }) => {
            this.items[obj.id].updatePosition();
        });
        activePlayers.on('player_added', (obj: { id: number; player: ifs.IPlayer }) => {
            this.addPlayer(obj.id);
        });
        activePlayers.on('player_removed', (id: number) => {
            this.displayObject.removeChild(this.items[id].displayObject);
            delete this.items[id];
            console.log('' + id + 'が削除');
            console.log('プレイヤー' + this.activePlayers.count() + '人が参加中');
        });
    }

    private addPlayer(id: number) {
        var playerView = new PlayerView(this.loadQueue, this.activePlayers.get(id), this.camera);
        this.displayObject.addChild(playerView.displayObject);
        this.items[id] = playerView;
        console.log('' + id + 'が追加');
        console.log(this.activePlayers);
        console.log('プレイヤー' + this.activePlayers.count() + '人が参加中');
    }
}
