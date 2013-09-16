import https = require('https');
import express = require('express');
import expressServer = require('./expressserver');
import Enumerable = require('./../lib/linq');

export = server;
function server(ipaddress: string, port: number, publicPath: string) {
    var get = {
    };
    expressServer(ipaddress, port, publicPath, { get: get });
}
