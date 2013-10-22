import ee2 = require('eventemitter2');
import iv = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import cifs = require('./../../../minesweeper-common/domain/entity/interfaces');
import dxo = require('./../../infrastructure/dxo');
import Player = require('./player');
import Landform = require('./landform');

export = ActivePlayers;
class ActivePlayers extends ee2.EventEmitter2 {
    private centralPlayer: number;
    private items: cifs.IHash<Player> = null;
    private emitter: Socket;

    get(id: number): Player {
        return this.items[id];
    }

    setEmitter(emitter: Socket) {
        this.emitter = emitter;
    }

    setPlayers(items: cifs.IHash<Player>, field: Landform) {
        this.items = items;
        Object.keys(items).forEach(id => {
            super.emit('player_added', { id: id, player: items[id] });
        });
        this.emitter.on('moved', (obj: iv.IMoveDTO) => {
            this.items[obj.id].coord = cdxo.toCoord(obj.coord);
            super.emit('player_moved', { id: obj.id, coord: this.items[obj.id].coord });
        });
        this.emitter.on('player_activated', (obj: { id: number; player: iv.IPlayerDTO }) => {
            var player = dxo.toPlayer(obj.player, field);
            this.items[obj.id] = player;
            super.emit('player_added', { id: obj.id, player: player });
            if (obj.id === this.centralPlayer) {
                this.get(this.centralPlayer).setEmitter(this.emitter);
                super.emit('central_player_selected', obj.id);
            }
        });
        this.emitter.on('player_deactivated', (obj: { id: number; player: iv.IPlayerDTO }) => {
            var player = this.items[obj.id];
            delete this.items[obj.id];
            super.emit('player_removed', obj.id);
        });
    }

    setCentralPlayer(id: number) {
        this.centralPlayer = id;
        if (this.get(id) != null) {
            this.get(id).setEmitter(this.emitter);
            super.emit('central_player_selected', id);
        }
    }

    getCentralPlayer() {
        return this.get(this.centralPlayer);
    }

    count() {
        return Enumerable.from(this.items).count();
    }
}
