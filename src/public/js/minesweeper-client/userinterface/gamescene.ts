import game = require('./../../framework/game');
import GameMain = require('./../application/gamemain');
import MineWorldView = require('./mineworldview');

export = GameScene;
class GameScene implements game.Scene {
    static resourceFiles = MineWorldView.resourceFiles;

    displayObject = new createjs.Container();
    private mineWorldView: MineWorldView;

    constructor(loadQueue: createjs.LoadQueue) {
        var gameMain = new GameMain();

        this.mineWorldView = new MineWorldView(loadQueue, gameMain);
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
