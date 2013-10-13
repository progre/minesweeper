import game = require('./../../framework/game');
import ioserver = require('./../infrastructure/server');
import MineWorld = require('./../domain/entity/mineworld');
import MineWorldView = require('./mineworldview');

export = GameScene;
class GameScene implements game.Scene {
    static resourceFiles = MineWorldView.resourceFiles;

    displayObject = new createjs.Container();
    private mineWorld = new MineWorld();
    private mineWorldView: MineWorldView;

    constructor(loadQueue: createjs.LoadQueue) {
        // サーバーに接続
        console.log('サーバーに接続します...');
        var server = ioserver.connect();
        server.on('connect', () => {
            console.log('接続しました');
            server.on('disconnect', () => {
                console.log('disconnect');
            });
            this.mineWorld.setEmitter(server);
        });

        this.mineWorldView = new MineWorldView(loadQueue, this.mineWorld);
        this.displayObject.addChild(this.mineWorldView.displayObject);
    }

    wakeup(size: game.Rect) {
        this.mineWorldView.setSize(size);
    }

    update(): game.Scene {
        return null;
    }

    resize(size: game.Rect) {
        this.mineWorldView.setSize(size);
    }

    suspend() {
    }
}
