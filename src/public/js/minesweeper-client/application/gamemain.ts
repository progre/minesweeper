import ActivePlayers = require('./../domain/entity/activeplayers');
import Landform = require('./../domain/entity/landform');
import ClientSocket = require('./../domain/entity/clientsocket');

export = GameMain;
class GameMain {
    activePlayers = new ActivePlayers();
    landform = new Landform();

    constructor() {
        // サーバーに接続
        console.log('サーバーに接続します...');
        var socket = new ClientSocket();
        socket.connect(() => {
            console.log('接続しました');

            this.activePlayers.setEmitter(socket.socket);
            this.landform.setEmitter(socket.socket);
            socket.onFullData(obj => {
                console.log('プレイヤー' + Enumerable.from(obj.activePlayers).count() + '人が参加中');
                this.activePlayers.setPlayers(obj.activePlayers, this.landform);
                this.activePlayers.setCentralPlayer(obj.yourID);
            });
        });
    }
}