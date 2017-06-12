import {Entity} from "../abstract/Entity";
import {BallView} from "../views/BallView";
import {BallComponent} from "../components/BallComponent";
export class Ball extends Entity {
    name = 'Ball';
    public components: any = {
        'BallComponent': new BallComponent(this),
        'BallView': new BallView(this)
    };
}
