import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');
import ActivePlayers = require('./../domain/entity/activeplayers');
import Player = require('./../domain/entity/player');
import Camera = require('./entity/camera');

class PlayerView {
    static resourceFiles = [
        '/img/remilia.png',
        '/img/hiyoco_nomal_full.png',
        '/img/hiyoco_lady_full.png',
        '/img/hiyoco_mecha_full.png',
        '/img/hiyoco_niwatori_full.png',
        '/img/hiyoco_waru_full.png'
    ];

    displayObject: createjs.Sprite;

    constructor(private loadQueue: createjs.LoadQueue, private model: Player, private camera: Camera) {
        this.displayObject = this.getCharactor(model.image);
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

    private getCharactor(name: string) {
        var ssOpt = {
            images: [],
            frames: { width: 32, height: 32 },
            animations: {
                'walk': { frames: [], speed: 1 / 6 }
            }
        };
        if (name === 'remilia') {
            ssOpt.images = [this.loadQueue.getResult('/img/remilia.png')];
            ssOpt.animations['walk'].frames = [0, 1, 2, 1];
        } else {
            ssOpt.images = [this.loadQueue.getResult(toFileName(name))];
            ssOpt.animations['walk'].frames = [6, 7, 8, 7];
        }
        var ss = new createjs.SpriteSheet(ssOpt);
        return new createjs.Sprite(ss);
    }
}

function toFileName(name: string) {
    switch (name) {
        case 'hiyoko': return '/img/hiyoco_nomal_full.png';
        case 'hiyoko_lady': return '/img/hiyoco_lady_full.png';
        case 'mecha_hiyoko': return '/img/hiyoco_mecha_full.png';
        case 'niwatori': return '/img/hiyoco_niwatori_full.png';
        case 'waru_hiyoko': return '/img/hiyoco_waru_full.png';
    }
}

function getHiyoko() {

    var ssOpt = {
        images: [this.loadQueue.getResult('/img/hiyoco_nomal_full.png')],
        frames: { width: 32, height: 32 },
        animations: {
            'walk': { frames: [0, 1, 2, 1], speed: 1 / 6 }
        }
    };
    var ss = new createjs.SpriteSheet(ssOpt);
    return new createjs.Sprite(ss);
}

export = ActivePlayersView;
class ActivePlayersView {
    static resourceFiles = PlayerView.resourceFiles;

    displayObject = new createjs.Container();
    private items: ifs.IHash<PlayerView> = {};
    private center: Coord;

    constructor(private loadQueue: createjs.LoadQueue, private camera: Camera, private activePlayers: ActivePlayers) {
        this.displayObject.mouseEnabled = false;

        activePlayers.on('player_moved', (obj: { id: number; coord: Coord }) => {
            if (obj.id === activePlayers.getCentralPlayerID())
                return;
            this.items[obj.id].updatePosition();
        });
        activePlayers.on('player_added', (obj: { id: number; player: ifs.IPlayer }) => {
            this.addPlayer(obj.id);
        });
        activePlayers.on('player_removed', (id: number) => {
            this.displayObject.removeChild(this.items[id].displayObject);
            delete this.items[id];
            console.log('' + id + 'を削除');
            console.log('プレイヤー' + this.activePlayers.count() + '人が参加中');
        });
    }

    private addPlayer(id: number) {
        var playerView = new PlayerView(this.loadQueue, this.activePlayers.get(id), this.camera);
        this.displayObject.addChild(playerView.displayObject);
        this.items[id] = playerView;
        console.log('' + id + 'を追加');
        console.log('プレイヤー' + this.activePlayers.count() + '人が参加中');
    }
}
