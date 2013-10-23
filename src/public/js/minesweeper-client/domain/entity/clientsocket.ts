import Enumerable = require('./../../../lib/linq');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import iv = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces'); import ioserver = require('./../infrastructure/server');
import server = require('./../../infrastructure/server');
import Player = require('./player');

export = ClientSocket;
class ClientSocket {
    public socket: Socket;

    connect(callback: () => void) {
        this.socket = server.connect();
        this.socket.on('connect', () => {
            this.socket.on('disconnect', () => {
                console.log('disconnect');
            });
            callback();
        });
    }

    onFullData(callback: (obj: { yourID: number; activePlayers: { [id: number]: Player }; }) => void) {
        this.socket.on('full_data', (dto: iv.IFullDataDTO) => {
            callback({
                yourID: dto.yourId,
                activePlayers: <{ [id: number]: Player }>Enumerable
                    .from(dto.activePlayers)
                    .select(x => ({ key: x.key, value: toPlayer(x.value) }))
                    .toObject(x => x.key, x => x.value)
            });
        });
    }
}

function toPlayer(dto: iv.IPlayerDTO): Player {
    return new Player(
        cdxo.toCoord(dto.coord),
        dto.image);
}