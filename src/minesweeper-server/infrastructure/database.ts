var MongoClient = require('mongodb').MongoClient;
var log4js = require('log4js');

var logger = log4js.getLogger('app');

export module chunks {
    export function get(key: string, callback: (value: any) => void): void {
        accessChunk((db, collection) => {
            if (collection == null) {
                callback(null);
                return;
            }
            collection.find({ key: key }).toArray((err, list) => {
                db.close(true);
                if (list == null || list[0].value == null) {
                    callback(null);
                    return;
                }
                callback(list[0].value);
            });
        });
    }

    export function put(key: string, value: any) {
        accessChunk((db, collection) => {
            if (collection == null) {
                return;
            }
            collection.remove({ key: key }, err=> {
                collection.insert({ key: key, value: value }, (err, docs) => {
                    db.close(true);
                });
            });
        });
    }

    function accessChunk(callback: (db: any, collection: any) => void): void {
        connect((err, db) => {
            if (err != null) {
                logger.error(err);
                db.close(true);
                callback(null, null);
                return;
            }
            callback(db, db.collection('chunks'));
        });
    }
};

function connect(callback: (err, db) => void) {
    var url = 'mongodb://'
        + (process.env.OPENSHIFT_MONGODB_DB_USERNAME != null
        ? process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':'
        + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@'
        : '')
        + (process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1') + ':'
        + (process.env.OPENSHIFT_MONGODB_DB_PORT || '27017') + '/'
        + 'minesweeper';
    MongoClient.connect(url, callback);
}
