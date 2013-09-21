/// <reference path='../../DefinitelyTyped/easeljs/easeljs.d.ts'/>
/// <reference path='../../DefinitelyTyped/preloadjs/preloadjs.d.ts'/>
/// <reference path='../../DefinitelyTyped/linq.d.ts'/>
/// <reference path='../../DefinitelyTyped/biginteger.d.ts'/>
/// <reference path='../../DefinitelyTyped/eventemitter2.d.ts'/>

var WS_ADDRESS = '127.0.0.1';
//var WS_ADDRESS = ':8000';

declare var io;
import game = require('./framework/game');
import MineWorld = require('./minesweeper/domain/entity/mineworld');
import MineWorldView = require('./minesweeper/userinterface/mineworldview');

class GameScene implements game.Scene {
    displayObject = new createjs.Container();
    private mineWorld = MineWorld.createLocal();
    private mineWorldView = new MineWorldView(this.mineWorld);

    static getResourceFiles() {
        return ['/img/block.png'];
    }

    constructor(loadQueue: createjs.LoadQueue) {
        this.displayObject.addChild(this.mineWorldView.displayObject);
        var server = io(WS_ADDRESS);
        var server = server.on('connect', () => {
            server.emit('hoge', 'hi all');
            server.on('event', data => {
                console.log(data);
                server.emit('hoge', 'fuck');
            });
            server.on('disconnect', () => {
                console.log('disconnect');
            });
        });
        server.on('connect_error', err => {
            console.log('error');
            console.log(err);
        });
        server.on('connect_timeout', hoge => {
            console.log('timeout');
            console.log(hoge);
        });
        server.on('reconnect', (attempt: number) => {
            console.log('reconnect');
            console.log(attempt);
        });
        server.on('reconnect_error', err => {
            console.log('reconnect_error');
            console.log(err);
        });
        server.on('reconnect_failed', hoge => {
            console.log('reconnect_failed');
            console.log(hoge);
        });
    }

    update(): game.Scene {
        return null;
    }
}

new game.Game(window, GameScene.getResourceFiles(), loadQueue => new GameScene(loadQueue), -1).run();
