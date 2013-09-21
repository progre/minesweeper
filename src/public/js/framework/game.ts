import presenter = require('./presenter');

export class Game {
    private dotBydot = false;

    constructor(
        private window: Window,
        private userAsset: any[],
        private userSceneFactory: (loadQueue: createjs.LoadQueue) => Scene,
        private width = 320,
        private height = 240) {

        if (width < 0) {
            this.dotBydot = true;
        }
    }

    run() {
        var canvas = <HTMLCanvasElement>this.window.document.getElementById('canvas');
        if (canvas == null) {
            var func = ev => {
                this.window.removeEventListener('focus', func);
                this.run();
            };
            this.window.addEventListener('focus', func);
        }
        var stage = new createjs.Stage(canvas);
        this.resize(canvas, stage);
        var presenterObj = new presenter.Presenter(stage, this.userAsset, this.userSceneFactory);
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
        if (this.dotBydot) {
            canvas.width = this.window.innerWidth;
            canvas.height = this.window.innerHeight;
            stage.scaleX = 1;
            stage.scaleY = 1;
            stage.x = canvas.width / 2;
            stage.y = canvas.height / 2;
            return;
        }
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
    /** 遷移するシーンを返す */
    update(): Scene;
}