import Coord = require('./../../minesweeper-common/domain/valueobject/coord');
import ifs = require('./../../minesweeper-common/domain/entity/interfaces');

export = MineWorldView;
class MineWorldView {
    displayObject = new createjs.Container();

    setModel(model: ifs.IMineWorld) {
        // players‚É“ü‚Á‚Ä‚é‚â‚Â‚ð•\Ž¦
        Enumerable.from(model.players).forEach((x: { key: string; value: any }) => {
            var playerView = new PlayerView(x.value);
            this.displayObject.addChild(playerView.displayObject);
        });
    }

    setArea(coord: Coord, width: number, height: number) {
    }
}

class PlayerView {
    displayObject: createjs.BitmapAnimation;

    constructor(private model: ifs.IPlayer) {
        var spriteSheet = {
            images: ['/img/remilia.png'],
            frames: { width: 32, height: 32 },
            animations: {
                'walk': { frames: [0, 1, 2, 1], frequency: 6 }
            }
        };
        var ss = new createjs.SpriteSheet(spriteSheet);
        this.displayObject = new createjs.BitmapAnimation(ss);
        this.displayObject.gotoAndPlay('walk');
    }

    update(center: Coord) {
        center.subtract(this.model.coord)
    }
}
