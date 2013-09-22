declare var io;
import game = require('./framework/game');
import MineWorldView = require('./mineworldview');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import iv = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import dxo = require('./../../minesweeper-common/infrastructure/service/dxo');

var WS_ADDRESS = '127.0.0.1';
//var WS_ADDRESS = ':8000';

export = GameScene;
class GameScene implements game.Scene {
    static resourceFiles = ['/img/block.png'].concat(MineWorldView.resourceFiles);

    displayObject = new createjs.Container();
    private mineWorldView: MineWorldView;

    constructor(loadQueue: createjs.LoadQueue) {
        this.mineWorldView = new MineWorldView(loadQueue);
        this.displayObject.addChild(this.mineWorldView.displayObject);

        // サーバーに接続
        var server = io(WS_ADDRESS);
        var server = server.on('connect', () => {
            server.on('full_data', (dto: iv.IFullDataDTO) => {
                this.mineWorldView.setModel(dxo.toMineWorld(dto));
                this.mineWorldView.center = Coord.of('1', '0');
            });
            server.on('move', (obj: iv.IMoveDTO) => {
                this.mineWorldView.players.move(obj.id, dxo.toCoord(obj.coord));
            });
            server.on('dig', (obj: iv.IMoveDTO) => {
                this.mineWorldView.players.move(obj.id, dxo.toCoord(obj.coord));
            });
            server.on('flag', (obj: iv.IMoveDTO) => {
                this.mineWorldView.players.move(obj.id, dxo.toCoord(obj.coord));
            });
            server.on('opened', () => {
            });
            server.on('flagged', () => {
            });
            server.on('bomb', () => {
            });
            server.on('disconnect', () => {
                console.log('disconnect');
            });

            this.mineWorldView.on('click', (e: { coord: Coord; type: number; }) => {
                if (false) {
                    server.emit('move', { coord: dxo.fromCoord(e.coord) });
                }
                if (e.type === 0) {
                    server.emit('dig', { coord: dxo.fromCoord(e.coord) });
                }
                if (e.type === 2) {
                    server.emit('flag', { coord: dxo.fromCoord(e.coord) });
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
        this.mineWorldView.size = size;
    }

    update(): game.Scene {
        return null;
    }

    resize(size: game.Rect) {
        this.mineWorldView.size = size;
    }

    suspend() {
    }
}
