export class Presenter {
    private scene: Scene;
    private loadQueue = new createjs.LoadQueue();

    constructor(private stage: createjs.Stage, private userAsset: any[], private userScene: Scene) {
    }

    load(callback: (eventObj: { target: createjs.LoadQueue }) => boolean) {
        this.loadQueue.addEventListener('complete', (eventObj: { target: createjs.LoadQueue }) => {
            this.setScene(new BrandScene(eventObj.target, this.userScene));
            return callback(eventObj);
        });
        this.loadQueue.loadManifest(['/img/brand.png'].concat(this.userAsset));
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
    /** ‘JˆÚ‚·‚éƒV[ƒ“‚ğ•Ô‚· */
    update(): Scene;
}

class BrandScene implements Scene {
    displayObject: createjs.Bitmap;
    private done = false;

    constructor(loadQueue: createjs.LoadQueue, private nextScene: Scene) {
        this.displayObject = new createjs.Bitmap(<any>loadQueue.getResult('/img/brand.png'));
        this.displayObject.alpha = 0.0;
        createjs.Tween.get(this.displayObject)
            .to({ alpha: 1.0 }, 1000)
            .wait(2000)
            .to({ alpha: 0.0 }, 1000)
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
