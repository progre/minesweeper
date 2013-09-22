export class Presenter {
    private scene: Scene;
    private loadQueue = new createjs.LoadQueue();
    private _size: Rect;

    constructor(
        private stage: createjs.Stage,
        private userAsset: any[],
        private userSceneFactory: (loadQueue: createjs.LoadQueue) => Scene) {
    }

    load() {
        this.setScene(new LoadScene(this.loadQueue, this.userSceneFactory));
        this.loadQueue.setMaxConnections(6);
        this.loadQueue.loadManifest(this.userAsset);
    }

    update() {
        var next = this.scene.update();
        this.setScene(next);
    }

    set size(value: Rect) {
        this._size = value;
        if (this.scene == null)
            return;
        this.scene.resize(value);
    }

    private setScene(next: Scene) {
        if (next == null)
            return;
        var prev = this.scene;
        next.wakeup(this._size);
        this.scene = next;
        this.stage.addChild(this.scene.displayObject);
        if (prev == null)
            return;
        this.stage.removeChild(prev.displayObject);
        prev.suspend();
    }
}

export interface Scene {
    displayObject: createjs.DisplayObject;
    /** ‘JˆÚ‚·‚éƒV[ƒ“‚ð•Ô‚· */
    wakeup(rect: Rect): void;
    update(): Scene;
    resize(rect: Rect): void;
    suspend(): void;
}

export interface Rect {
    width: number;
    height: number;
}

class LoadScene implements Scene {
    displayObject: createjs.Container;
    private nextScene: Scene;
    private loadAnimation: createjs.Tween;
    private loadComplete = false;
    private done = false;

    constructor(private loadQueue: createjs.LoadQueue, private userSceneFactory: (loadQueue: createjs.LoadQueue) => Scene) {
        loadQueue.addEventListener('complete', (eventObj: { target: createjs.LoadQueue }) => {
            this.loadComplete = true;
            //this.loadAnimation.play(null);
            this.nextScene = this.userSceneFactory(eventObj.target);
            return true;
        });

        this.displayObject = new createjs.Container();
        this.displayObject.addChild(createWall('#fff'));
        var logo = new createjs.Bitmap('/img/brand.png');
        logo.x = -logo.image.width / 2;
        logo.y = -logo.image.height / 2;
        this.displayObject.addChild(logo);
        var front = createWall('#000');
        this.displayObject.addChild(front);
        front.alpha = 1.0;
        this.loadAnimation = createjs.Tween.get(front);
        this.loadAnimation.to({ alpha: 0.0 }, 1000)
            .wait(2000)
            .call(tweenObject => {
                if (!this.loadComplete)
                    tweenObject.pause(null);
            })
            .to({ alpha: 1.0 }, 1000)
            .call(tweenObject => {
                this.done = true;
            });
    }

    wakeup(size: Rect) {
    }

    update() {
        if (this.done)
            return this.nextScene;
        return null;
    }

    resize(rect: Rect) {
    }

    suspend() {
        // ‚à‚¤ŒÄ‚Î‚ê‚È‚¢‚Ì‚ÅŠO‚µ‚Ä‚¨‚­
        this.displayObject = null;
        this.loadQueue.remove('/img/brand.png');
    }
}

function createWall(color: string) {
    var wall = new createjs.Shape();
    wall.graphics.beginFill(color).drawRect(0, 0, 65535, 65535);
    wall.x = -65535 / 2;
    wall.y = -65535 / 2;
    return wall;
}
