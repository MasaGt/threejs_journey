//シングルトンパターン(Experience)
import { Experience } from "./Experience";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class Camera {
    // Experienceクラスをグローバルアクセス可能にした場合の、Cameraの初期化コード
    // constructor() {
    //     this.scene = window.experience.scene;
    //     this.sizes = window.experience.sizes;
    //     this.canvas = window.experience.canvas;
    //     this.setInstance();
    //     this.setOrbitControls();
    // }

    // Cameraクラス初期化に必要なパラメーターを引数にて渡す方法
    constructor(scene, sizes, canvas) {
        this.scene = scene;
        this.sizes = sizes;
        this.canvas = canvas;
        this.setInstance();
        this.setOrbitControls();
    }

    // Experienceクラスにシングルトンパターンを採用した場合のCameraの初期化コード
    // constructor() {
    //     this.experience = new Experience();
    //     this.scene = this.experience.scene;
    //     this.sizes = this.experience.sizes;
    //     this.canvas = this.experience.canvas;
    //     this.setInstance();
    //     this.setOrbitControls();
    // }

    // Three.PerspectiveCameraを作成
    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100);
        this.instance.position.set(6, 4, 8);
        this.scene.add(this.instance);
    }

    // OrbitControlsの作成
    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        // this.controls.enableDamping = true;
    }

    resize() {
        // Update camera
        // ★Sizesはコンストラクターにてwindow.addEventListner("resize")で自身のプロパティを更新しているので、Sizesの更新は明示的に呼ばなくてもいい
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        if (this.controls.enableDamping) {
            this.controls.update();
        }
    }
}