/// <reference path='../../DefinitelyTyped/easeljs/easeljs.d.ts'/>
/// <reference path='../../DefinitelyTyped/preloadjs/preloadjs.d.ts'/>
/// <reference path='../../DefinitelyTyped/linq.d.ts'/>
/// <reference path='../../DefinitelyTyped/biginteger.d.ts'/>
/// <reference path='../../DefinitelyTyped/eventemitter2.d.ts'/>

import game = require('./framework/game');
import GameScene = require('./minesweeper/userinterface/gamescene');

new game.Game(window, GameScene.getResourceFiles(), loadQueue => new GameScene(loadQueue), -1).run();
