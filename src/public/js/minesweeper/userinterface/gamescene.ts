declare var io;
import game = require('./framework/game');
import MineWorldView = require('./mineworldview');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import iv = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import de = require('./../../minesweeper-common/domain/entity/interfaces');

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
                this.mineWorldView.setModel(unpack(dto));
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

function unpack(dto: iv.IFullDataDTO): de.IMineWorld {
    return {
        yourId: dto.yourId,
        players: Enumerable.from(dto.players)
            .select((x: KVP<iv.IPlayerDTO>) => ({ key: x.key, value: unpackPlayer(x.value) }))
            .toObject(x => x.key, x => x.value)
    };
}

function unpackPlayer(dto: iv.IPlayerDTO): de.IPlayer {
    return {
        coord: unpackCoord(dto.coord),
        image: dto.image
    };
}

var unpackCoord = (dto: iv.ICoordDTO) => Coord.of(dto.x, dto.y);

interface KVP<T> {
    key: string;
    value: T;
}
