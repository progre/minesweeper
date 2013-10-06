var log4js = require('log4js');
import ifs = require('./../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../minesweeper-common/infrastructure/service/dxo');
import usersRepository = require('./../infrastructure/usersrepository');
import dxo = require('./../infrastructure/dxo');
import MineWorld = require('./../domain/entity/mineworld');

var logger = log4js.getLogger();

export = Client;
class Client {
    private userId: string;
    private playerId: number;

    constructor(private client: any, private mineWorld: MineWorld) {
        logger.log('connecting from: ' + client.id);
        client.on('user_id', userId => {
            this.userId = userId;

            var data: ifs.IFullDataDTO = {
                yourId: this.playerId,
                activePlayers: dxo.fromActivePlayers(this.mineWorld.activePlayers)
            };
            client.emit('full_data', data);

            // ユーザーデータをリストア
            this.restoreOrCreatePlayerId(client);

            client.join(0); // とりあえずroomに入れておく

            client.on('disconnect', () => {
                logger.log('disconnect: ' + client.id);
                this.store();
            });
        });
    }

    private restoreOrCreatePlayerId(client: EventEmitter) {
        var user = usersRepository.get(this.userId);
        if (user == null) {
            this.playerId = this.mineWorld.createPlayer();
            usersRepository.create(this.userId, { playerId: this.playerId });
            user = usersRepository.get(this.userId);
        }
        this.mineWorld.activatePlayer(user.playerId, client);
        this.playerId = user.playerId;
    }

    private store() {
        this.mineWorld.deactivatePlayer(this.playerId);
    }
}
