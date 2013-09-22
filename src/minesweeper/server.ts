var log4js = require('log4js');
import expressServer = require('./expressserver');
import Player = require('./domain/entity/player');
import Coord = require('./../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../minesweeper-common/infrastructure/valueobject/interfaces');

var logger = log4js.getLogger();

export = server;
function server(ipaddress: string, port: number, publicPath: string) {

    var get = {
    };
    expressServer(ipaddress, port, publicPath, { get: get, io: io });
}

function io(io) {
    io.on('connection', client => {
        client.join(0); // ‚Æ‚è‚ ‚¦‚¸room‚É“ü‚ê‚Ä‚¨‚­

        client.on('move', (obj: { coord: ifs.ICoordDTO }) => {
            logger.info(obj);
        });
        client.on('dig', (obj: { coord: ifs.ICoordDTO }) => {
            io.in(0).emit('dig', { id: '0', coord: obj.coord });
        });
        client.on('flag', (obj: { coord: ifs.ICoordDTO }) => {
            logger.info(obj);
        });
        client.on('disconnect', () => {
            logger.info('disconnect');
        });

        var data: ifs.IFullDataDTO = {
            yourId: '0',
            players: {
                0: { coord: { x: '0', y: '0' }, image: 'remilia' }
            }
        };
        client.emit('full_data', data);
    });
};
