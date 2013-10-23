declare var io;
declare var cookie;
import BigInteger = require('jsbn');

var WS_ADDRESS = location.href.indexOf('minesweeper') >= 0
    ? 'minesweeper-progre.rhcloud.com:8000'
    : '127.0.0.1';

export function connect() {
    var server: Socket = io(WS_ADDRESS);
    server.on('connect', () => {
        server.emit('user_id', getOrCreateUserId());
    });
    server.on('connect_error', err => {
        console.log('error');
        console.log(err);
    });
    server.on('connect_timeout', hoge => {
        console.log('timeout');
        console.log(hoge);
    });
    server.on('reconnect', (attempt: number) => {
        console.log('reconnect');
        console.log(attempt);
    });
    server.on('reconnect_error', err => {
        console.log('reconnect_error');
        console.log(err);
    });
    server.on('reconnect_failed', hoge => {
        console.log('reconnect_failed');
        console.log(hoge);
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
    // “K“–‚É•³’·‚¢—”‚ğì‚é
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
