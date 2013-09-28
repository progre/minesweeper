declare var io;
declare var cookie;
import BigInteger = require('jsbn');

var WS_ADDRESS = '127.0.0.1';
//var WS_ADDRESS = ':8000';

export function connect() {
    var server = io(WS_ADDRESS);
    server.on('connect', () => {
        server.emit('user_id', getOrCreateUserId());
    });
    return server;
}

function getOrCreateUserId() {
    var userId = cookie.get('user_id');
    if (userId != null) {
        return userId;
    }
    cookie.set('user_id', createUserId());
    userId = cookie.get('user_id');
    if (userId == null)
        throw new Error('cookie is not supported.');
    return userId;
}

function createUserId() {
    // 適当に糞長い乱数を作る
    var id = '';
    for (var i = 0; i < 77; i++) {
        id += random10();
    }
    return new BigInteger(id).toString(36);
}

function random10() {
    var n = Math.random() * 10 | 0;
    if (n === 10) {
        n = 0;
    }
    return n;
}
