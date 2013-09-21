/// <reference path="DefinitelyTyped/node/node.d.ts"/>
/// <reference path="DefinitelyTyped/express/express.d.ts"/>

import fs = require('fs');
import path = require('path');
var log4js = require('log4js');
import server = require('./minesweeper/server');

var LOG_DIRECTORY = __dirname + '/log'
if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, '777');
}
log4js.configure({
    appenders: [{
        type: 'console',
    }]
});

var ipaddress = process.env.OPENSHIFT_INTERNAL_IP
    || process.env.OPENSHIFT_NODEJS_IP
    || 'localhost';
var port = parseInt(process.argv[2], 10)
    || process.env.OPENSHIFT_INTERNAL_PORT
    || process.env.OPENSHIFT_NODEJS_PORT
    || 80;

server(ipaddress, port, __dirname + '/public');
