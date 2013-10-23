import Enumerable = require('./../../../lib/linq');
import Chunk = require('./../../../minesweeper-common/domain/entity/chunk');
import cdxo = require('./../../../minesweeper-common/infrastructure/service/dxo');
import ifs = require('./../../../minesweeper-common/infrastructure/valueobject/interfaces');
import ClientTile = require('./../../../minesweeper-common/domain/valueobject/clienttile');
import Coord = require('./../../../minesweeper-common/domain/valueobject/coord');
import server = require('./../../infrastructure/server');
import Player = require('./player');

export = ClientSocket;
class ClientSocket {
    private socket: Socket;

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
        this.socket.on('full_data', (dto: ifs.IFullDataDTO) =>
            callback({
                yourID: dto.yourId,
                activePlayers: <{ [id: number]: Player }>Enumerable
                    .from(dto.activePlayers)
                    .select(x => ({ key: x.key, value: toPlayer(x.value) }))
                    .toObject(x => x.key, x => x.value)
            }));
    }

    onChunk(callback: (obj: { coord: Coord; chunk: Chunk<ClientTile> }) => void) {
        this.socket.on('chunk', (obj: { coord: ifs.ICoordDTO; chunk: ClientTile[][] }) =>
            callback({
                coord: cdxo.toCoord(obj.coord),
                chunk: <Chunk<ClientTile>>new Chunk(obj.chunk)
            }));
    }

    onTile(callback: (obj: { coord: Coord; tile: ClientTile }) => void) {
        this.socket.on('tile', (obj: { coord: ifs.ICoordDTO; tile: ClientTile }) =>
            callback({ coord: cdxo.toCoord(obj.coord), tile: obj.tile }));
    }

    onExploded(callback: (coord: Coord) => void) {
        this.socket.on('exploded', (coordDTO: ifs.ICoordDTO) =>
            callback(cdxo.toCoord(coordDTO)));
    }

    onMoved(callback: (obj: { id: number; coord: Coord }) => void) {
        this.socket.on('moved', (obj: ifs.IMoveDTO) =>
            callback({ id: obj.id, coord: cdxo.toCoord(obj.coord) }));
    }

    onPlayerActivated(callback: (obj: { id: number; player: Player }) => void) {
        this.socket.on('player_activated', (obj: { id: number; player: ifs.IPlayerDTO }) =>
            callback({ id: obj.id, player: toPlayer(obj.player) }));
    }

    onPlayerDeactivated(callback: (obj: { id: number; player: Player }) => void) {
        this.socket.on('player_deactivated', (obj: { id: number; player: ifs.IPlayerDTO }) =>
            callback({ id: obj.id, player: toPlayer(obj.player) }));
    }

    joinChunk(coord: Coord) {
        this.socket.emit('join_chunk', cdxo.fromCoord(coord));
    }

    move(coord: Coord) {
        this.socket.emit('move', cdxo.fromCoord(coord));
    }

    dig(coord: Coord) {
        this.socket.emit('dig', cdxo.fromCoord(coord));
    }

    flag(coord: Coord) {
        this.socket.emit('flag', cdxo.fromCoord(coord));
    }

    question(coord: Coord) {
        this.socket.emit('question', cdxo.fromCoord(coord));
    }

    removeQuestion(coord: Coord) {
        this.socket.emit('remove_question', cdxo.fromCoord(coord));
    }
}

function toPlayer(dto: ifs.IPlayerDTO): Player {
    return new Player(
        cdxo.toCoord(dto.coord),
        dto.image);
}