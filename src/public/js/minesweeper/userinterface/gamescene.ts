import game = require('./../../framework/game');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import iv = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import dxo = require('./../../minesweeper-common/infrastructure/service/dxo');
import Client = require('./../application/client');
import Server = require('./../application/server');
import ioserver = require('./../infrastructure/server');
import MineWorldView = require('./mineworldview');

export = GameScene;
class GameScene implements game.Scene {
    static resourceFiles = ['/img/block.png'].concat(MineWorldView.resourceFiles);

    displayObject = new createjs.Container();
    private mineWorldView: MineWorldView;

    constructor(loadQueue: createjs.LoadQueue) {
        this.mineWorldView = new MineWorldView(loadQueue);
        this.displayObject.addChild(this.mineWorldView.displayObject);
        new Client(this.mineWorldView);
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
