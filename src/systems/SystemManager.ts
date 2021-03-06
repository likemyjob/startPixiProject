import {System} from "../abstract/System";
import {BodyIntSystem} from "./initialize/BodyInitSystem";
import {ViewIntSystem} from "./initialize/ViewInitSystem";
import {RenderViewSystem} from "./RenderViewSystem";
import {PlayerMovementSystem} from "./PlayerMovementSystem";
import {MouseInitSystem} from "./initialize/MouseInitSystem";
import {WallManager} from "./initialize/WallManager";
import {EnemyManager} from "./EnemyManager";
import {Container} from "typedi";
import {DestroySystem} from "./DestroySystem";
export class SystemManager extends System {
    constructor() {
        super();
        SystemManager.initSystems();
    }

    static initSystems() {
        new BodyIntSystem();
        new WallManager();
        new MouseInitSystem();
        new ViewIntSystem();
        new RenderViewSystem();
        new PlayerMovementSystem();
        Container.get(EnemyManager);
        new DestroySystem();
    }
}

