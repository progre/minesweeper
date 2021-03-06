import ee2 = require('eventemitter2');
import cifs = require('./../../../minesweeper-common/domain/entity/interfaces');
import Landform = require('./landform');
import ClientSocket = require('./clientsocket');
import Player = require('./player');

export = ActivePlayers;
class ActivePlayers extends ee2.EventEmitter2 {
    private centralPlayerID: number;
    private items: cifs.IHash<Player> = [];
    private socket: ClientSocket;

    get(id: number): Player {
        return this.items[id];
    }

    setSocket(socket: ClientSocket) {
        this.socket = socket;
    }

    setPlayers(items: cifs.IHash<Player>, field: Landform) {
        this.items = items;
        Object.keys(items).forEach(id => {
            items[parseInt(id)].setField(field);
            super.emit('player_added', { id: id, player: items[id] });
        });
        this.socket.onMoved(obj => {
            this.items[obj.id].coord = obj.coord;
            super.emit('player_moved', obj);
        });
        this.socket.onPlayerActivated(obj => {
            obj.player.setField(field);
            this.items[obj.id] = obj.player;
            super.emit('player_added', obj);
            if (obj.id === this.centralPlayerID) {
                this.selectCentralPlayer();
            }
        });
        this.socket.onPlayerDeactivated(obj => {
            var player = this.items[obj.id];
            delete this.items[obj.id];
            super.emit('player_removed', obj.id);
        });
    }

    setCentralPlayer(id: number) {
        this.centralPlayerID = id;
        if (this.get(id) != null) {
            this.selectCentralPlayer();
        }
    }

    getCentralPlayer() {
        return this.get(this.centralPlayerID);
    }

    getCentralPlayerID() {
        return this.centralPlayerID;
    }

    count() {
        return Enumerable.from(this.items).count();
    }

    private selectCentralPlayer() {
        this.getCentralPlayer().setSocket(this.socket);
        super.emit('central_player_selected', this.centralPlayerID);
    }
}
