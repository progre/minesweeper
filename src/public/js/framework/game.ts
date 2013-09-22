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
        var presenterObj = new presenter.Presenter(stage, this.userAsset, this.userSceneFactory);
        this.setSize(canvas, stage, presenterObj);
        this.window.addEventListener('resize', () => this.setSize(canvas, stage, presenterObj));

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addListener(() => {
            presenterObj.update();
            stage.update();
        });
        presenterObj.load();
    }

    private setSize(canvas: HTMLCanvasElement, stage: createjs.Stage, presenterObj: presenter.Presenter) {
        if (this.dotBydot) {
            this.setSizeDotbydot(
                canvas, stage, presenterObj,
                new Rect(this.window.innerWidth,
                    this.window.innerHeight));
            return;
        }
        var windowWidth = this.window.innerWidth;
        var windowHeight = this.window.innerHeight;
        if (windowWidth / windowHeight < this.width / this.height) {
            this.setScaledSize(
                canvas, stage, presenterObj,
                new Rect(windowWidth,
                    windowWidth * (this.height / this.width)));
        } else {
            this.setScaledSize(
                canvas, stage, presenterObj,
                new Rect(windowHeight * (this.width / this.height),
                    windowHeight));
        }
    }

    private setSizeDotbydot(canvas: HTMLCanvasElement, stage: createjs.Stage, presenterObj: presenter.Presenter, rect: Rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        stage.scaleX = 1;
        stage.scaleY = 1;
        stage.x = canvas.width >> 1;
        stage.y = canvas.height >> 1;
        presenterObj.size = rect;
    }

    private setScaledSize(canvas: HTMLCanvasElement, stage: createjs.Stage, presenterObj: presenter.Presenter, rect: Rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        stage.scaleX = rect.width / this.width;
        stage.scaleY = rect.height / this.height;
        presenterObj.size = rect;
    }
}

export interface Scene extends presenter.Scene {
}

export class Rect implements presenter.Rect {
    constructor(
        public width: number,
        public height: number) {
    }
}