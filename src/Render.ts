/// <reference path="../node_modules/@types/box2d/index.d.ts" />
/// <reference path="../node_modules/@types/pixi.js/index.d.ts" />
/// <reference path="helpers/FPSMeter.d.ts" />
import {Container, Service} from "typedi";
import {Wall} from "./entities/Wall";
import {BodyIntSystem} from "./systems/initialize/BodyInitSystem";
import {Ball} from "./entities/Ball";
import {RenderViewSystem} from "./systems/RenderViewSystem";
import {ViewIntSystem} from "./systems/initialize/ViewInitSystem";
import {Player} from "./entities/Player";
import {PlayerMovementSystem} from "./systems/PlayerMovementSystem";
import {MouseInitSystem} from "./systems/initialize/MouseInitSystem";
import {Enemy} from "./entities/Enemy";
import {Contact} from "./listeners/Contact";
import b2ContactListener = Box2D.Dynamics.b2ContactListener;
// import {Ball} from "./entities/Ball";
// import {BodyIntSystem} from "./systems/initialize/BodyInitSystem";
// import {ViewIntSystem} from "./systems/initialize/ViewInitSystem";
// import {RenderViewSystem} from "./systems/RenderViewSystem";
// import {Player} from "./entities/Player";
// import {PlayerMovementSystem} from "./systems/PlayerMovementSystem";
// import {Wall} from "./entities/Wall";
// import {MouseInitSystem} from "./systems/initialize/MouseInitSystem";
// import b2World = Box2D.Dynamics.b2World;
// import b2Vec2 = Box2D.Common.Math.b2Vec2;
@Service()
export class Render {


    public box2d = require("box2dweb/box2d.js");
    public static SIZE = 20;

    public app: PIXI.Application;
    public width: number;
    public height: number;
    public resources: any;

    public entities: any = [];
    private systems: any = [];

    public gravity: Box2D.Common.Math.b2Vec2 = new this.box2d.Common.Math.b2Vec2(0, 10);
    public world: Box2D.Dynamics.b2World = new this.box2d.Dynamics.b2World(this.gravity, true);
    public b2AABB: Box2D.Collision.b2AABB = new this.box2d.Collision.b2AABB();
    public timeStep: number = 1 / 60;
    public velocityIterations: number = 10;
    public positionIterations: number = 10;

    public hz = 60;

    public stop = false;

    constructor() {
        PIXI.loader
            .add('sample', 'Assets/sample.png')
            .load(this.onLoaded.bind(this));
    }

    addEntity(obj: any) {
        this.entities.push(obj);
    }

    addSystem(obj: any) {
        this.systems.push(obj);
    }

    private resize() {
        this.width = document.getElementById('wrapper').offsetWidth;
        this.height = document.getElementById('wrapper').offsetHeight;
        let that = this;
        window.onresize = function (event) {
            that.width = document.getElementById('wrapper').offsetWidth;
            that.height = document.getElementById('wrapper').offsetHeight;
            that.app.renderer.resize(that.width, that.height);
        };
    }

    public update(delta: number) {
        this.systems.forEach(function (system: any) {
            system.update(delta);
        });
    }

    public onLoaded(loader: any, res: any) {
        this.resize();
        this.app = new PIXI.Application(this.width, this.height, {
            backgroundColor: 0x1a6f1d,
            antialias: true,
            autoResize: true
        }, false);
        document.getElementById('wrapper').appendChild(this.app.view);
        this.app.stop();

        this.resources = res;
        let meter = new FPSMeter();

        let LeftWall = new Wall();
        LeftWall.components['WallComponent'].position.Set(5, this.height / 2);
        LeftWall.components['WallComponent'].width = 10;
        LeftWall.components['WallComponent'].height = this.height;

        let RightWall = new Wall();
        RightWall.components['WallComponent'].position.Set(this.width - 5, this.height / 2);
        RightWall.components['WallComponent'].width = 10;
        RightWall.components['WallComponent'].height = this.height;

        let TopWall = new Wall();
        TopWall.components['WallComponent'].position.Set(this.width / 2, 5);
        TopWall.components['WallComponent'].width = this.width;
        TopWall.components['WallComponent'].height = 10;

        let DownWall = new Wall();
        DownWall.components['WallComponent'].position.Set(this.width / 2, this.height - 5);
        DownWall.components['WallComponent'].width = this.width;
        DownWall.components['WallComponent'].height = 100;


        let player = Container.get(Player);
        player.components['PlayerComponent'].position.Set(this.width / 2, this.height - 60);


        let enemies: any = [];

        let maxEnemy = 5;
        let distance = 50;
        let shift = (maxEnemy - 1) * distance / 2;
        for (let i = 0; i < maxEnemy; i++) {
            for (let j = 0; j < maxEnemy; j++) {
                enemies[i * j] = new Enemy();
                enemies[i * j].components['EnemyComponent'].position.Set(j * 10 + this.width / 2 + i * distance - shift, this.height/4 - j * distance + shift);
            }
        }


        let balls: any = [];
        //
        // for (let i = 1; i < 600; i++) {
        //     balls[i] = new Ball();
        //     balls[i].components['BallComponent'].position.Set(this.getRandom(10, this.width+10), this.getRandom(10, this.height - 110));
        //     balls[i].components['BallComponent'].radius = 10;
        //     balls[i].components['BallComponent'].density = 1;
        //     balls[i].components['BallComponent'].restitution = 0.01;
        // }
        //
        let ball = new Ball();
        ball.components['BallComponent'].position.Set(this.width / 2, this.height - 120);

        let bodyIntSystem = new BodyIntSystem();

        let viewIntSystem = new ViewIntSystem();
        let renderViewSystem = new RenderViewSystem();

        let plSystem = new PlayerMovementSystem();
        let mSystem = new MouseInitSystem();




        this.init();

        this.app.start();
        let that = this;

        setInterval(function () {
            if (!that.stop) {
                that.world.Step(that.timeStep, that.velocityIterations, that.positionIterations);
                that.world.ClearForces();
                that.world.DrawDebugData();
            }
        }, 1000 / 60);

        this.app.ticker.add((delta: number) => {
            meter.tick();
            that.update(delta);
        });
    }

    getRandom(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }


    init() {
        let b2Vec2 = this.box2d.Common.Math.b2Vec2
            , b2AABB = this.box2d.Collision.b2AABB
            , b2BodyDef = this.box2d.Dynamics.b2BodyDef
            , b2Body = this.box2d.Dynamics.b2Body
            , b2FixtureDef = this.box2d.Dynamics.b2FixtureDef
            , b2Fixture = this.box2d.Dynamics.b2Fixture
            , b2World = this.box2d.Dynamics.b2World
            , b2MassData = this.box2d.Collision.Shapes.b2MassData
            , b2PolygonShape = this.box2d.Collision.Shapes.b2PolygonShape
            , b2CircleShape = this.box2d.Collision.Shapes.b2CircleShape
            , b2DebugDraw = this.box2d.Dynamics.b2DebugDraw
            , b2MouseJointDef = this.box2d.Dynamics.Joints.b2MouseJointDef,
            b2ContactListener = this.box2d.Dynamics.b2ContactListener
        ;

        // this.world = new b2World(
        //     new b2Vec2(0, 10)    //gravity
        //     , true                 //allow sleep
        // );

        let contactListener = new Contact();
        this.world.SetContactListener(contactListener);


        //setup debug draw
        let debugDraw = new b2DebugDraw();
        let can: any = document.getElementById("test");

        can.width = this.width / 4;
        can.height = this.height / 4;

        debugDraw.SetSprite(can.getContext("2d"));
        debugDraw.SetDrawScale(5.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);
    }

}
