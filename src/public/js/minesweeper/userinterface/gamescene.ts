import game = require('./framework/game');
import MineWorldView = require('./mineworldview');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import iv = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import dxo = require('./../../minesweeper-common/infrastructure/service/dxo');
import ioserver = require('./../infrastructure/server');

export = GameScene;
class GameScene implements game.Scene {
    static resourceFiles = ['/img/block.png'].concat(MineWorldView.resourceFiles);

    displayObject = new createjs.Container();
    private mineWorldView: MineWorldView;

    constructor(loadQueue: createjs.LoadQueue) {
        this.mineWorldView = new MineWorldView(loadQueue);
        this.displayObject.addChild(this.mineWorldView.displayObject);

        // サーバーに接続
        var server = ioserver.connect();
        server.on('connect', () => {
            server.on('full_data', (dto: iv.IFullDataDTO) => {
                this.mineWorldView.setModel(dxo.toMineWorld(dto));

                server.on('moved', (obj: iv.IMoveDTO) => {
                    this.mineWorldView.activePlayers.move(obj.id, dxo.toCoord(obj.coord));
                });
                server.on('digged', (obj: iv.IMoveDTO) => {
                    this.mineWorldView.activePlayers.move(obj.id, dxo.toCoord(obj.coord));
                });
                server.on('flagged', (obj: iv.IMoveDTO) => {
                    this.mineWorldView.activePlayers.move(obj.id, dxo.toCoord(obj.coord));
                });
                server.on('opened', () => {
                });
                server.on('flagged', () => {
                });
                server.on('bombed', () => {
                });
                server.on('player_activated', (obj: { id: number; player: iv.IPlayerDTO }) => {
                    this.mineWorldView.activePlayers.addPlayer(obj.id, dxo.toPlayer(obj.player));
                });
                server.on('player_deactivated', (obj: { id: number; player: iv.IPlayerDTO }) => {
                    this.mineWorldView.activePlayers.removePlayer(obj.id);
                });
            });

            server.on('disconnect', () => {
                console.log('disconnect');
            });

            this.mineWorldView.on('click', (e: { coord: Coord; type: number; }) => {
                if (false) {
                    server.emit('move', dxo.fromCoord(e.coord));
                }
                if (e.type === 0) {
                    console.log(dxo.fromCoord(e.coord)); // スリープ復帰とかに吹っ切れる
                    server.emit('dig', dxo.fromCoord(e.coord));
                }
                if (e.type === 2) {
                    server.emit('flag', dxo.fromCoord(e.coord));
                }
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
