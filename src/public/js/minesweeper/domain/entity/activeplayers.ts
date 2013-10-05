import ee2 = require('eventemitter2');
import iv = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import cifs = require('./../../../minesweeper-common/domain/entity/interfaces');

export = ActivePlayers;
class ActivePlayers extends ee2.EventEmitter2 {
    private centralPlayer: number;
    private items: cifs.IHash<cifs.IPlayer> = {};

    get(id: number): cifs.IPlayer {
        return this.items[id];
    }

    setEmitter(emitter: ee2.EventEmitter2) {
        emitter.on('moved', (obj: iv.IMoveDTO) => {
            this.items[obj.id].coord = cdxo.toCoord(obj.coord);
        });
        // TODO: ‚±‚Ì•Ó‚Ímoved‚ª‚ ‚ê‚Î‚¢‚ç‚È‚¢
        emitter.on('digged', (obj: iv.IMoveDTO) => {
            this.items[obj.id].coord = cdxo.toCoord(obj.coord);
        });
        emitter.on('flagged', (obj: iv.IMoveDTO) => {
            this.items[obj.id].coord = cdxo.toCoord(obj.coord);
        });
        emitter.on('player_activated', (obj: { id: number; player: iv.IPlayerDTO }) => {
            var player = cdxo.toPlayer(obj.player);
            this.items[obj.id] = player;
            super.emit('player_added', { id: obj.id, player: player });
        });
        emitter.on('player_deactivated', (obj: { id: number; player: iv.IPlayerDTO }) => {
            var player = this.items[obj.id];
            delete this.items[obj.id];
            super.emit('player_removed', obj.id);
        });
    }

    setPlayers(items: cifs.IHash<cifs.IPlayer>) {
        this.items = items;
    }

    setCentralPlayer(id: number) {
        this.centralPlayer = id;
        super.emit('central_player_selected', id);
    }
}
