import game = require('./../../framework/game');
import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import GameMain = require('./../application/gamemain');
import Camera = require('./entity/camera');
import ActivePlayersView = require('./activeplayersview');
import LandformView = require('./landformview');

export = MineWorldView;
class MineWorldView {
    static resourceFiles = ActivePlayersView.resourceFiles.concat(LandformView.resourceFiles);

    displayObject = new createjs.Container();
    private clickObject = createWall();
    private landformView: LandformView;
    private activePlayersView: ActivePlayersView;
    private size = new game.Rect(0, 0);
    private camera = new Camera(Coord.of('0', '0'));

    constructor(private loadQueue: createjs.LoadQueue, gameMain: GameMain) {
        this.landformView = new LandformView(loadQueue, gameMain.landform, this.camera);
        this.activePlayersView = new ActivePlayersView(loadQueue, this.camera, gameMain.activePlayers);

        gameMain.activePlayers.on('central_player_selected', (id: number) => {
            this.camera.setCenter(gameMain.activePlayers.get(id).coord);
            //gameMain.activePlayers.on('player_moved', (obj: { id: number; coord: Coord }) => {
            //    if (obj.id !== id)
            //        return;
            //    this.camera.setCenter(obj.coord);
            //    this.landformView.refreshBlocks();
            //});
            var player = gameMain.activePlayers.getCentralPlayer();
            player.on('moved', () => {
                this.camera.setCenter(player.coord);
                this.landformView.refreshBlocks();
            });
        });

        this.clickObject.addEventListener('click', (eventObj: any) => {
            var coord = this.camera.fromDisplayToAbsolute(
                eventObj.stageX - (this.size.width >> 1),
                eventObj.stageY - (this.size.height >> 1));
            var type = eventObj.nativeEvent.button;
            gameMain.activePlayers.getCentralPlayer().action(type === 0, coord);
        });

        this.displayObject.addChild(this.clickObject);
        this.displayObject.addChild(this.landformView.backDisplayObject);
        this.displayObject.addChild(this.activePlayersView.displayObject);
        this.displayObject.addChild(this.landformView.frontDisplayObject);
    }

    /** •`‰æƒGƒŠƒAŽw’è */
    setSize(value: game.Rect) {
        this.size = value;
        this.landformView.setSize(value);
    }
}

function createWall() {
    var wall = new createjs.Shape();
    wall.graphics.beginFill('#0000').drawRect(0, 0, 65535, 65535);
    wall.x = -65535 / 2;
    wall.y = -65535 / 2;
    return wall;
}
