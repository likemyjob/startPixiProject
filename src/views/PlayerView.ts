import {Render} from "../Render";
import {View} from "../abstract/View";
export class PlayerView extends View {

    public render: Render;

    constructor() {
        super();

        this.container = new PIXI.Container();

        let gr = new PIXI.Graphics();
        gr.lineStyle(2, 0x000000, 1);
        gr.beginFill(0xEEE5E5, 1);
        gr.drawRoundedRect(0, 0, 100, 10, 1);
        gr.endFill();

        this.container.addChild(gr);
        this.setDefaultPosition();
        this.render.app.stage.addChild(this.container);
    }

    setDefaultPosition() {
        this.container.position.x = (this.render.width - this.container.width) / 2;
        this.container.position.y = this.render.height - this.container.height - 40;
    }
}
