var log4js = require('log4js');
import Enumerable = require('./../lib/linq');
import Coord = require('./../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../minesweeper-common/infrastructure/service/dxo');
import expressServer = require('./expressserver');
import MineWorld = require('./domain/entity/mineworld');
import Player = require('./domain/entity/player');
import dxo = require('./infrastructure/dxo');
import Client = require('./domain/entity/client');

var logger = log4js.getLogger();

export = Server;
class Server {
    /** sessionId -> playerId */
    private sessions: IHash<number> = {};
    private mineWorld: MineWorld;
    /** playerId -> player */
    private activePlayers: IHash<Player> = {};

    constructor(ipAddress: string, port: number, publicPath: string) {
        expressServer(ipAddress, port, publicPath, {
            get: {
            },
            ioHandler: io => {
                // DBからWorldをリストアする予定
                this.mineWorld = this.getMineWorld(io.in(0));
                io.on('connection', client => {
                    client.join(0); // とりあえずroomに入れておく
                    new Client(client, this.mineWorld);
                });
            }
        });
    }

    private getMineWorld(clients: any) {
        // DBからWorldをリストアする予定
        var mineWorld = new MineWorld(clients);
        return mineWorld;
    }
}

interface IHash<T> {
    [key: string]: T;
}

interface IUser {
    playerId: number;
}
