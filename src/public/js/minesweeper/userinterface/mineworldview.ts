import MineWorld = require('./../domain/entity/mineworld');

export = MineWorldView;
class MineWorldView  {
    displayObject = new createjs.Container();

    constructor(private model: MineWorld) {
    }
}
