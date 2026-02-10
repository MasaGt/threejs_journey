/**
 * Fox 3D モデルを管理するクラス
 */

import * as THREE from "three";

export class Fox {

    constructor(scene, resources, gui) {
        console.log("Foxのコンストラクター")
        this.scene = scene;
        this.resources = resources;
        this.gui = gui;
        //add Fox model to the Scene
        this.model = this.resources.model.scene;
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        });
        this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model);
        
        //set animation
        this.setAnimation();
        
        // set up debugUI
        if (this.gui.isActive) {
            //debugGUIで操作対象となるアニメーション操作オブジェクト
            this.animationPlayConfig = {
                playSurvey: () => {
                    this.animationConfig.play(this.animationConfig.actions.lookingAround);
                },
                playWalk: () => {
                    this.animationConfig.play(this.animationConfig.actions.walking);
                },
                playRun: () => {
                    this.animationConfig.play(this.animationConfig.actions.running);
                }
            };
            this.foxDebug = this.gui.gui.addFolder("Fox");
            this.foxDebug.add(this.animationPlayConfig, "playSurvey");
            this.foxDebug.add(this.animationPlayConfig, "playWalk");
            this.foxDebug.add(this.animationPlayConfig, "playRun");
        }
    }

    setAnimation() {
        this.animationConfig = {}
        this.animationConfig.mixer = new THREE.AnimationMixer(this.model);

        //Animation Clipの種類を格納するオブジェクトの作成
        this.animationConfig.actions = {};
        this.animationConfig.actions.lookingAround = this.animationConfig.mixer.clipAction(this.resources.model.animations[0]);
        this.animationConfig.actions.walking = this.animationConfig.mixer.clipAction(this.resources.model.animations[1]);
        this.animationConfig.actions.running = this.animationConfig.mixer.clipAction(this.resources.model.animations[2]);
        
        this.animationConfig.actions.current = this.animationConfig.actions.lookingAround;
        this.animationConfig.actions.current.play();
        
        this.animationConfig.play = (animationClip) => {
            //↓Three.js journeyでのアニメーションの切り替えコード
            const prevAnimation = this.animationConfig.actions.current;
            const newAnimation = animationClip;
            prevAnimation.stop();
            newAnimation.play();
            this.animationConfig.actions.current = newAnimation;

            //自分で考えて書いたアニメーションの切り替えコード
            // if (this.animationConfig.actions.current != animationClip) {
            //     //トランジションなしのアニメーションの切り替え
            //     // this.animationConfig.actions.current.stop();
            //     // this.animationConfig.actions.current = animationClip;
            //     // this.animationConfig.actions.current.play();
                
            //     //トランジションありのアニメーションの切り替え
            //     const prev = this.animationConfig.actions.current;
            //     let next = animationClip;
            //     // prev.crossFadeTo(next, 0.5, false).play();
            //     next.crossFadeFrom(prev, 0.5, false).play();
            //     prev.stop();
            //     this.animationConfig.actions.current = next;
            // }
        }

    }

    update(timer) {
        this.animationConfig.mixer.update(timer.delta*0.001);
    }
}