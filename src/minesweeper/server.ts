var log4js = require('log4js');
import Enumerable = require('./../lib/linq');
import expressServer = require('./expressserver');
import Player = require('./domain/entity/player');
import Coord = require('./../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../minesweeper-common/infrastructure/valueobject/interfaces');
import dxo = require('./../minesweeper-common/infrastructure/service/dxo');

var logger = log4js.getLogger();

export = Server;
class Server {
    /** sessionId -> playerId */
    private sessions: IHash<number> = {};
    /** playerId -> player */
    private activePlayers: IHash<Player> = {};

    constructor(ipAddress: string, port: number, publicPath: string) {
        var get = {
        };
        expressServer(ipAddress, port, publicPath, { get: get, ioHandler: io => { this.ioHandler(io) } });
    }

    ioHandler(io: any) {
        io.on('connection', client => {
            logger.log('connecting from: ' + client.id);
            client.on('session_id', sessionId => {
                // ユーザーデータをリストア
                var obj = this.restoreOrCreate(sessionId);

                logger.log('playerId=' + obj.id + ', player.coord=' + obj.player.coord);

                client.join(0); // とりあえずroomに入れておく
                this.setClientAction(client, io.in(0), obj.id, obj.player);

                client.on('disconnect', () => {
                    logger.log('disconnect: ' + client.id);
                    this.store(sessionId);
                });

                var data: ifs.IFullDataDTO = {
                    yourId: obj.id,
                    players: {
                        0: { coord: dxo.fromCoord(obj.player.coord), image: obj.player.image }
                    }
                };
                client.emit('full_data', data);
            });
        });
    }

    private restoreOrCreate(sessionId: string) {
        var obj = Repository.getPlayerFromSessionId(sessionId);
        if (obj == null) {
            Repository.putPlayerToSessionId(sessionId, new Player(Coord.of('0', '0'), 'remilia'));
            obj = Repository.getPlayerFromSessionId(sessionId);
        }
        this.activePlayers[obj.id] = obj.player;
        return obj;
    }

    private store(sessionId: string) {
        Repository.putPlayerToSessionId(sessionId, this.activePlayers[sessionId]);
        delete this.activePlayers[sessionId];
    }

    private setClientAction(client: any, room: any, playerId: number, player: Player) {
        client.on('move', (obj: { coord: ifs.ICoordDTO }) => {
            logger.info(obj);
        });
        client.on('dig', (obj: { coord: ifs.ICoordDTO }) => {
            player.coord = dxo.toCoord(obj.coord);
            room.emit('dig', { id: playerId, coord: dxo.fromCoord(player.coord) });
        });
        client.on('flag', (obj: { coord: ifs.ICoordDTO }) => {
            logger.info(obj);
        });
    }
}

module Repository {
    /** DBなんか無かった */
    var users: IHash<IUser> = {};
    var players: IHash<Player> = {};

    export function getPlayerFromSessionId(sessionId: string) {
        if (sessionId == null)
            return null;
        var user = users[sessionId];
        if (user == null)
            return null;
        var player = players[user.playerId];
        if (player == null)
            return null;
        return { id: user.playerId, player: player };
    }

    export function putPlayerToSessionId(sessionId: string, player: Player) {
        var user = users[sessionId];
        if (user == null) {
            user = { playerId: countPlayers() };
            users[sessionId] = user;
        }
        players[user.playerId] = player;
    }

    function countPlayers() {
        return Enumerable.from(players).count();
    }
}

interface IHash<T> {
    [key: string]: T;
}

interface IUser {
    playerId: number;
}
