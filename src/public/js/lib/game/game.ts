import presenter = require('./presenter');

export class Game {
    constructor(
        private window: Window,
        private userAsset: any,
        private userScene: Scene,
        private width = 320,
        private height = 240) {
    }

    run() {
        var canvas = <HTMLCanvasElement>this.window.document.getElementById('canvas');
        var stage = new createjs.Stage(canvas);
        this.resize(canvas, stage);
        var presenterObj = new presenter.Presenter(stage, this.userAsset, this.userScene);
        this.window.addEventListener('resize', () => this.resize(canvas, stage));

        presenterObj.load(eventObj => {
            createjs.Ticker.setFPS(60);
            createjs.Ticker.addListener(() => {
                presenterObj.update();
                stage.update();
            });
            return true;
        });
    }

    private resize(canvas: HTMLCanvasElement, stage: createjs.Stage) {
        var windowWidth = this.window.innerWidth;
        var windowHeight = this.window.innerHeight;
        if (windowWidth / windowHeight < this.width / this.height) {
            this.setSize(
                canvas, stage,
                windowWidth,
                windowWidth * (this.height / this.width));
        } else {
            this.setSize(
                canvas, stage,
                windowHeight * (this.width / this.height),
                windowHeight);
        }
    }

    private setSize(canvas: HTMLCanvasElement, stage: createjs.Stage, width: number, height: number) {
        canvas.width = width;
        canvas.height = height;
        stage.scaleX = width / this.width;
        stage.scaleY = height / this.height;
    }
}

export interface Scene {
    displayObject: createjs.DisplayObject;
    /** ‘JˆÚ‚·‚éƒV[ƒ“‚ð•Ô‚· */
    update(): Scene;
}