/// <reference path='../../DefinitelyTyped/easeljs/easeljs.d.ts'/>
/// <reference path='../../DefinitelyTyped/preloadjs/preloadjs.d.ts'/>
/// <reference path='../../DefinitelyTyped/linq.d.ts'/>
/// <reference path='../../DefinitelyTyped/eventemitter2.d.ts'/>

import game = require('./framework/game');
import MineWorld = require('./minesweeper/domain/entity/mineworld');
import MineWorldView = require('./minesweeper/userinterface/mineworldview');

class GameScene implements game.Scene {
    displayObject = new createjs.Container();
    private mineWorld = new MineWorld();

    constructor(loadQueue: createjs.LoadQueue) {
        var block = new createjs.Bitmap(
            <any>loadQueue.getResult('/img/block.png'));
        this.displayObject.addChild(block);
    }

    update(): game.Scene {
        return null;
    }
}

new game.Game(window, ['/img/block.png'], loadQueue => new GameScene(loadQueue), -1).run();
