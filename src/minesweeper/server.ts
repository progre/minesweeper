var log4js = require('log4js');
import expressServer = require('./expressserver');

export = server;
function server(ipaddress: string, port: number, publicPath: string) {
    var logger = log4js.getLogger();

    var get = {
    };
    var socket = {
        'connection': client => {
            client.join('0');
            logger.info(client);
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
