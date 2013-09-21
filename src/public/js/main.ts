/// <reference path='../../DefinitelyTyped/easeljs/easeljs.d.ts'/>
/// <reference path='../../DefinitelyTyped/preloadjs/preloadjs.d.ts'/>
/// <reference path='../../DefinitelyTyped/linq.d.ts'/>
/// <reference path='../../DefinitelyTyped/biginteger.d.ts'/>
/// <reference path='../../DefinitelyTyped/eventemitter2.d.ts'/>

import game = require('./framework/game');
import MineWorld = require('./minesweeper/domain/entity/mineworld');
import MineWorldView = require('./minesweeper/userinterface/mineworldview');

class GameScene implements game.Scene {
    displayObject = new createjs.Container();
    private mineWorld = MineWorld.createLocal();
    private mineWorldView = new MineWorldView(this.mineWorld);

    constructor(loadQueue: createjs.LoadQueue) {
        this.displayObject.addChild(this.mineWorldView.displayObject);
    }

    update(): game.Scene {
        return null;
    }
}

new game.Game(window, ['/img/block.png'], loadQueue => new GameScene(loadQueue), -1).run();
