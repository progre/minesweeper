import MapBase = require('./../../../minesweeper-common/domain/entity/mapbase');

export = ClientMap;

class ClientMap extends MapBase {
    constructor() {
        super(key => {
            return null;
        });
    }
}
