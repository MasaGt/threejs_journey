import { Sizes } from "./Utils/Sizes";
import { Timer } from "./Utils/Timer";
import * as THREE from "three";
import { Camera } from "./Camera";
import { Renderer } from "./Renderer";
import { World } from "./World/World";
import { Debug } from "./Utils/Debug";

//シングルトンパターン
// let instance = null;

export class Experience {
    constructor (canvas) {
        // ↓はこのクラスをグローバルアクセス可能にするコード
        // window.experience = this;

        //シングルトンパターン
        // if (instance) {
        //     return instance;
        // }
        // instance = this;

        this.canvas = canvas;

        this.gui = new Debug();

        this.sizes = new Sizes();

        this.timer = new Timer();

        this.scene = new THREE.Scene();
        
        // this.camera = new Camera(); //シングルトンパターンやExperienceをグローバルアクセス可能にしたケースに利用
        this.camera = new Camera(this.scene, this.sizes, this.canvas); //Cameraクラスを初期化する際にパラメーターを引数として渡す方法

        this.renderer = new Renderer(this.scene, this.sizes, this.canvas, this.camera);
        
        this.world = new World(this.scene, this.gui);

        // EventListners
        this.sizes.on("resize", () => {
            this.resize();
        });

        this.timer.on("tick", () => {
            this.update();
        });

        if (this.gui.isActive) {
            const expDebugConfig = {
                destroryExp: () => {
                    this.destroy();
                }
            }
            this.experienceDebug = this.gui.gui.addFolder("Experience");
            this.experienceDebug.add(expDebugConfig, "destroryExp").name("Dispose");

        }
    }

    resize() {
        // ★Sizesはコンストラクターにてwindow.addEventListner("resize")で自身のプロパティを更新しているので、Sizesの更新は明示的に呼ばなくてもいい
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        this.camera.update();
        this.world.update(this.timer);
        this.renderer.update();
    }

    destroy() {
        this.sizes.off("resize");
        this.timer.off("tick");

        //アニメーションの停止

        // traverse the scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                //ジオメトリの解放
                child.geometry.dispose();

                //マテリアル中のテクスチャの解放
                //★Mesh.material は iterableではないのでfor ofで回すことはできない
                for (const prop in child.material) {
                    if (child.material[prop] instanceof THREE.Texture) {
                        child.material[prop].dispose();
                    }
                    // const val = child.material[prop];
                    // if (val && typeof val.dispose === "function") {        
                    //     console.log(val);
                    // }
                }

                //マテリアルの破棄
                child.material.dispose();
            }
        });

        // オービットコントロールの破棄
        this.camera.controls.dispose();

        //カメラの破棄
        this.scene.remove(this.camera.instance);

        //rendererの作成
        this.renderer.instance.renderLists.dispose();
        this.renderer.instance.dispose();

        //canvasの削除
        this.renderer.instance.domElement.remove();
    }
}