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

            // ���[�U�[�f�[�^�����X�g�A
            this.restoreOrCreatePlayerId();

            client.join(0); // �Ƃ肠����room�ɓ���Ă���
            this.setEvents();

            client.on('disconnect', () => {
                logger.log('disconnect: ' + client.id);
                this.store();
            });

            var data: ifs.IFullDataDTO = {
                yourId: this.playerId,
                activePlayers: dxo.fromActivePlayers(this.mineWorld.activePlayers)
            };
            client.emit('full_data', data);
        });
    }

    private restoreOrCreatePlayerId() {
        var user = usersRepository.get(this.userId);
        if (user != null) {
            this.mineWorld.activatePlayer(user.playerId);
            this.playerId = user.playerId;
        } else {
            this.playerId = this.mineWorld.createPlayer();
            usersRepository.create(this.userId, { playerId: this.playerId });
        }
    }

    private store() {
        this.mineWorld.deactivatePlayer(this.playerId);
    }

    private setEvents() {
        // chunk�̃��X�i�[�ɒǉ��Bdefect����܂�chunk�̕ύX��ʒm����
        this.client.on('join_chunk', (coord: ifs.ICoordDTO) => {
            this.client.emit('chunk', this.mineWorld.map.getViewPointChunk(cdxo.toCoord(coord)));
        });
        this.client.on('defect_chunk', () => {
        });
        this.client.on('move', (coord: ifs.ICoordDTO) => {
            logger.info(coord);
        });
        this.client.on('dig', (coord: ifs.ICoordDTO) => {
            console.log(coord.x, coord.y)
            this.mineWorld.digPlayer(this.playerId, cdxo.toCoord(coord));
        });
        this.client.on('flag', (coord: ifs.ICoordDTO) => {
            logger.info(coord);
        });
    }
}
