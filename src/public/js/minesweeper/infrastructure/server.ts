declare var io;
declare var cookie;
import bi = require('biginteger');

var WS_ADDRESS = '127.0.0.1';
//var WS_ADDRESS = ':8000';

export function connect() {
    var server = io(WS_ADDRESS);
    server.on('connect', () => {
        server.emit('session_id', getOrCreateSessionId());
    });
    return server;
}

function getOrCreateSessionId() {
    var sessionId = cookie.get('session_id');
    if (sessionId != null) {
        return sessionId;
    }
    cookie.set('session_id', createSessionId());
    sessionId = cookie.get('session_id');
    if (sessionId == null)
        throw new Error('cookie is not supported.');
    return sessionId;
}

function createSessionId() {
    // “K“–‚É•³’·‚¢—”‚ğì‚é
    var id = '';
    for (var i = 0; i < 77; i++) {
        id += random10();
    }
    return new bi.BigInteger(id).toString(36);
}

function random10() {
    var n = Math.random() * 10 | 0;
    if (n === 10) {
        n = 0;
    }
    return n;
}
