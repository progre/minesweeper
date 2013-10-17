import enums = require('./../../minesweeper-common/domain/valueobject/enums');
import ClientTile = require('./../../minesweeper-common/domain/valueobject/clienttile');

export = TileView;
class TileView {
    constructor(
        public base: createjs.Sprite,
        public lowLayer: createjs.Sprite,
        public highLayer: createjs.Sprite) {
    }

    setPos(x: number, y: number) {
        this.base.x = x;
        this.base.y = y;
        this.lowLayer.x = x;
        this.lowLayer.y = y;
        this.highLayer.x = x;
        this.highLayer.y = y;
    }

    update(model: ClientTile) {
        if (model == null) {
            model = ClientTile.UNKNOWN;
        }
        switch (model.status) {
            case enums.Status.CLOSE:
                this.updateOnClose(model);
                break;
            case enums.Status.OPEN:
                this.updateOnOpen(model);
                break;
            default:
                this.base.gotoAndStop('unknown');
                this.lowLayer.visible = false;
                this.highLayer.visible = false;
                break;
        }
    }

    private updateOnClose(model: ClientTile) {
        this.base.gotoAndStop('close');
        this.highLayer.visible = false;
        switch (model.layer) {
            case enums.Layer.FLAG:
                this.lowLayer.gotoAndStop('🚩');
                this.lowLayer.visible = true;
                return;
            case enums.Layer.QUESTION:
                this.lowLayer.gotoAndStop('?');
                this.lowLayer.visible = true;
                return;
            case enums.Layer.NONE:
                this.lowLayer.visible = false;
                return;
            default:
                this.lowLayer.gotoAndStop('unknown');
                this.lowLayer.visible = true;
                return;
        }
    }

    private updateOnOpen(model: ClientTile) {
        this.base.gotoAndStop('open');
        switch (model.landform) {
            case enums.Landform.BOMB:
                this.lowLayer.gotoAndStop('💣');
                this.lowLayer.visible = true;
                this.highLayer.visible = false;
                return;
            case enums.Landform.NONE:
                var mines = model.mines;
                if (mines === 0) {
                    this.highLayer.visible = false;
                    this.lowLayer.visible = false;
                    return;
                }
                if (0 < mines && mines <= 8) {
                    this.highLayer.gotoAndStop((mines - 1).toString());
                    this.highLayer.visible = true;
                    this.lowLayer.visible = false;
                    return;
                }
                // goto default:
            default:
                this.highLayer.gotoAndStop('unknown');
                this.highLayer.visible = true;
                this.lowLayer.visible = false;
                return;
        }
    }
}
