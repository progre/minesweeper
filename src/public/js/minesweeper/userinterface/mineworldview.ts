import ee2 = require('eventemitter2');
import game = require('./../../framework/game');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');
import Camera = require('./../domain/entity/camera');
import ClientMap = require('./../domain/entity/clientmap');
import PlayersView = require('./playersview');
import BlocksView = require('./blocksview');

export = MineWorldView;
class MineWorldView extends ee2.EventEmitter2 {
    static resourceFiles = PlayersView.resourceFiles;

    displayObject = new createjs.Container();
    private clickObject = createWall();
    private blocks: BlocksView;
    activePlayers: PlayersView;
    private size = new game.Rect(0, 0);
    private camera = new Camera(Coord.of('0', '0'));

    constructor(private loadQueue: createjs.LoadQueue, map: ClientMap) {
        super();
        this.displayObject.addChild(this.clickObject);
        this.blocks = new BlocksView(loadQueue, map);
        this.displayObject.addChild(this.blocks.backDisplayObject);
        this.activePlayers = new PlayersView(loadQueue, this.camera);
        this.displayObject.addChild(this.activePlayers.displayObject);

        this.clickObject.addEventListener('click', (eventObj: any) => {
            super.emit('click', {
                coord: this.camera.fromDisplayToAbsolute(
                    eventObj.stageX - (this.size.width >> 1),
                    eventObj.stageY - (this.size.height >> 1)),
                type: eventObj.nativeEvent.button
            });
        });
    }

    setSize(value: game.Rect) {
        this.size = value;
        this.blocks.size = value;
    }

    setModel(model: ifs.IMineWorld) {
        this.camera.setCenter(model.players[model.yourId].coord);
        this.activePlayers.setModel(model.players);
    }

    private moveCenter(x: number, y: number) {
    }
}

function createWall() {
    var wall = new createjs.Shape();
    wall.graphics.beginFill('#000').drawRect(0, 0, 65535, 65535);
    wall.x = -65535 / 2;
    wall.y = -65535 / 2;
    return wall;
}
