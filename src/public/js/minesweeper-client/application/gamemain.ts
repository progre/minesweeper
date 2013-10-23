import ActivePlayers = require('./../domain/entity/activeplayers');
import Landform = require('./../domain/entity/landform');
import ClientSocket = require('./../domain/entity/clientsocket');

export = GameMain;
class GameMain {
    activePlayers = new ActivePlayers();
    landform = new Landform();

    constructor() {
        // �T�[�o�[�ɐڑ�
        console.log('�T�[�o�[�ɐڑ����܂�...');
        var socket = new ClientSocket();
        socket.connect(() => {
            console.log('�ڑ����܂���');

            this.activePlayers.setEmitter(socket.socket);
            this.landform.setEmitter(socket.socket);
            socket.onFullData(obj => {
                console.log('�v���C���[' + Enumerable.from(obj.activePlayers).count() + '�l���Q����');
                this.activePlayers.setPlayers(obj.activePlayers, this.landform);
                this.activePlayers.setCentralPlayer(obj.yourID);
            });
        });
    }
}