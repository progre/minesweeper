/// <reference path='../../DefinitelyTyped/easeljs/easeljs.d.ts'/>
/// <reference path='../../DefinitelyTyped/preloadjs/preloadjs.d.ts'/>
/// <reference path='../../DefinitelyTyped/linq.d.ts'/>
/// <reference path='../../DefinitelyTyped/jsbn.d.ts'/>
/// <reference path='../../DefinitelyTyped/eventemitter2-module.d.ts'/>

import game = require('./framework/game');
import GameScene = require('./minesweeper/userinterface/gamescene');

new game.Game(window, GameScene.resourceFiles, loadQueue => new GameScene(loadQueue), -1).run();
