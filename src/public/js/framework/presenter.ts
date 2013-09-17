export class Presenter {
    private scene: Scene;
    private loadQueue = new createjs.LoadQueue();

    constructor(
        private stage: createjs.Stage,
        private userAsset: any[],
        private userSceneFactory: (loadQueue: createjs.LoadQueue) => Scene) {
    }

    load(callback: (eventObj: { target: createjs.LoadQueue }) => boolean) {
        this.loadQueue.addEventListener('complete', (eventObj: { target: createjs.LoadQueue }) => {
            this.setScene(new LoadScene(this.userSceneFactory(eventObj.target)));
            return callback(eventObj);
        });
        this.loadQueue.setMaxConnections(6);
        this.loadQueue.loadManifest(this.userAsset);
    }

    update() {
        var next = this.scene.update();
        if (next == null)
            return;
        this.stage.removeChild(this.scene.displayObject);
        this.setScene(next);
    }

    private setScene(scene: Scene) {
        this.scene = scene;
        this.stage.addChild(scene.displayObject);
    }
}

export interface Scene {
    displayObject: createjs.DisplayObject;
    /** ‘JˆÚ‚·‚éƒV[ƒ“‚ð•Ô‚· */
    update(): Scene;
}

class LoadScene implements Scene {
    displayObject: createjs.Container;
    private done = false;

    constructor(private nextScene: Scene) {
        this.displayObject = new createjs.Container();
        this.displayObject.addChild(createWall('#fff'));
        var logo = new createjs.Bitmap('/img/brand.png');
        logo.x = -logo.image.width / 2;
        logo.y = -logo.image.height / 2;
        this.displayObject.addChild(logo);
        var front = createWall('#000');
        this.displayObject.addChild(front);
        front.alpha = 1.0;
        createjs.Tween.get(front)
            .to({ alpha: 0.0 }, 1000)
            .wait(2000)
            .to({ alpha: 1.0 }, 1000)
            .call(tweenObject => {
                this.done = true;
            });
    }

    update() {
        if (this.done)
            return this.nextScene;
        return null;
    }
}

function createWall(color: string) {
    var wall = new createjs.Shape();
    wall.graphics.beginFill(color).drawRect(0, 0, 65535, 65535);
    wall.x = -65535 / 2;
    wall.y = -65535 / 2;
    return wall;
}
