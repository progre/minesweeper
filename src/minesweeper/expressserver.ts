import http = require('http');
import express = require('express');
var log4js = require('log4js');

export = server;
function server(ipaddress: string, port: number, publicPath: string, router:any) {
    var logger = log4js.getLogger();
    var app = express();
    app.configure(() => {
        app.use((req, res, next) => {
            writeAccessLog(logger, req, res);
            next();
        });
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static(publicPath));
        app.use(app.router);

        for (var key in router) {
            if (key === 'get') {
                var gets = router[key];
                for (var path in gets) {
                    app.get(path, gets[path]);
                }
            }
        }
    });

    app.configure('development', () => {
        app.use(express.logger('dev'));
        app.use(express.errorHandler());
    });

    http.createServer(app).listen(port, ipaddress, null,
        () => logger.info('Express server listening on port ' + port));
}

function writeAccessLog(logger: any, req: http.ServerRequest, res: http.ServerResponse) {
    logger.info([
        req.headers['x-forwarded-for'] || (<any>req).client.remoteAddress,
        new Date().toLocaleString(),
        req.method,
        req.url,
        res.statusCode,
        req.headers.referer || '-',
        req.headers['user-agent'] || '-'
    ].join('\t'));
}
