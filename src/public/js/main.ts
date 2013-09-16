/// <reference path='../../DefinitelyTyped/easeljs/easeljs.d.ts'/>
/// <reference path='../../DefinitelyTyped/preloadjs/preloadjs.d.ts'/>
/// <reference path='../../DefinitelyTyped/linq.d.ts'/>

import game = require('./lib/game/game');

class GameScene implements game.Scene {
    displayObject = new createjs.Container();

    constructor() {
    }

    update(): game.Scene {
        return null;
    }
}

new game.Game(window, [], new GameScene()).run();
