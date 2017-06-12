import {PlayerView} from "../PlayerView";
import {ViewIntSystem} from "../../systems/initialize/ViewInitSystem";
import {PlayerComponent} from "../../components/PlayerComponent";
export class PlayerGr {
    static initPlayer(component: PlayerView) {
        if (ViewIntSystem.checkInit(component)) {
            return;
        }

        let bodyComp: PlayerComponent = component.entity.components['PlayerComponent'];
        let gr: any = component.container.getChildAt(0);
        gr.lineStyle(2, 0x000000, 1);
        gr.beginFill(0xEEE5E5, 1);
        gr.drawRoundedRect(0, 0, bodyComp.width, bodyComp.height, 1);
        gr.endFill();

        component.container.pivot.x = component.container.width / 2;
        component.container.pivot.y = component.container.height / 2;
        ViewIntSystem.syncPosition(component, bodyComp);
    }
}