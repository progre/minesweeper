var log4js = require('log4js');
import Enumerable = require('./../lib/linq');
import Coord = require('./../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../minesweeper-common/infrastructure/service/dxo');
import expressServer = require('./expressserver');
import MineWorld = require('./domain/entity/mineworld');
import Player = require('./domain/entity/player');
import dxo = require('./infrastructure/service/dxo');
import usersRepository = require('./domain/repository/usersrepository');

var logger = log4js.getLogger();

export = Server;
class Server {
    /** sessionId -> playerId */
    private sessions: IHash<number> = {};
    private mineWorld: MineWorld;
    /** playerId -> player */
    private activePlayers: IHash<Player> = {};

    constructor(ipAddress: string, port: number, publicPath: string) {
        // DBからWorldをリストアする予定
        this.mineWorld = new MineWorld();
        this.mineWorld.on('player_activated', (obj: { id: number; player: Player }) => {

        });

        var get = {
        };
        expressServer(ipAddress, port, publicPath, { get: get, ioHandler: io => { this.ioHandler(io) } });
    }

    ioHandler(io: any) {
        io.on('connection', client => {
            logger.log('connecting from: ' + client.id);
            client.on('session_id', sessionId => {
                // ユーザーデータをリストア
                var playerId = this.restoreOrCreate(sessionId);
                logger.log('playerId=' + playerId);

                client.join(0); // とりあえずroomに入れておく
                this.setClientAction(client, io.in(0), playerId, this.mineWorld.activePlayers[playerId]);

                client.on('disconnect', () => {
                    logger.log('disconnect: ' + client.id);
                    this.store(sessionId);
                });
                var data: ifs.IFullDataDTO = {
                    yourId: playerId,
                    activePlayers: dxo.fromActivePlayers(this.mineWorld.activePlayers)
                };
                console.log(data);
                client.emit('full_data', data);
            });
        });
    }

    private restoreOrCreate(userId: string) {
        var user = usersRepository.get(userId);
        var playerId: number;
        if (user != null) {
            playerId = user.playerId;
            this.mineWorld.activatePlayer(playerId);
        } else {
            playerId = this.mineWorld.createPlayer();
            usersRepository.create(userId, { playerId: playerId });
        }
        return playerId;
    }

    private store(userId: string) {
        var user = usersRepository.get(userId);
        this.mineWorld.deactivatePlayer(user.playerId);
    }

    private setClientAction(client: any, room: any, playerId: number, player: Player) {
        client.on('move', (obj: { coord: ifs.ICoordDTO }) => {
            logger.info(obj);
        });
        client.on('dig', (coord: ifs.ICoordDTO) => {
            player.coord = cdxo.toCoord(coord);
            room.emit('dig', { id: playerId, coord: cdxo.fromCoord(player.coord) });
        });
        client.on('flag', (obj: { coord: ifs.ICoordDTO }) => {
            logger.info(obj);
        });
    }
}

interface IHash<T> {
    [key: string]: T;
}

interface IUser {
    playerId: number;
}
