var log4js = require('log4js');
import expressServer = require('./expressserver');
import Player = require('./domain/entity/player');
import Coord = require('./../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../minesweeper-common/infrastructure/valueobject/interfaces');

export = server;
function server(ipaddress: string, port: number, publicPath: string) {
    var logger = log4js.getLogger();

    var get = {
    };
    var socket = {
        'connection': client => {
            client.join(0); // ‚Æ‚è‚ ‚¦‚¸room‚É“ü‚ê‚Ä‚¨‚­
            var data: ifs.IFullDataDTO = {
                yourId: '0',
                players: {
                    0: { coord: { x: '0', y: '0' }, image: 'remilia' }
                }
            };
            client.emit('full_data', data);
            client.on('event', data => {
                logger.info(data);
            });
            client.on('hoge', data => {
                logger.info(data);
            });
            client.on('disconnect', () => {
                logger.info('disconnect');
            });
            client.emit('event', 'hi');
        }
    };
    expressServer(ipaddress, port, publicPath, { get: get, socket: socket });
}
