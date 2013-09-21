import MineWorld = require('./../domain/entity/mineworld');
import Player = require('./../domain/entity/player');
import Coord = require('./../domain/valueobject/coord');

export = MineWorldView;
class MineWorldView {
    displayObject = new createjs.Container();

    constructor(private model: MineWorld) {
        // players‚É“ü‚Á‚Ä‚é‚â‚Â‚ð•\Ž¦
        Enumerable.from(model.players).forEach((x: { key: string; value: Player }) => {
            var playerView = new PlayerView(x.value);
            this.displayObject.addChild(playerView.displayObject);
        });
    }

    setArea(coord: Coord, width: number, height: number) {
    }
}

class PlayerView {
    displayObject: createjs.BitmapAnimation;

    constructor(private model: Player) {
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
