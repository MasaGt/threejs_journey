/**
 * LightやEnvMapを管理するクラス
 */
import * as THREE from "three";

export class Environment {

    constructor(scene, gui, resources) {
        this.scene = scene;
        this.gui = gui;
        this.resources = resources;
        
        this.setLights();
        this.setEnvMap();
    }
    
    setLights() {
        /**
         * Lights
         */
        // const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
        const directionalLight = new THREE.DirectionalLight('#ffffff', 4)
        directionalLight.castShadow = true
        directionalLight.shadow.camera.far = 15
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.normalBias = 0.05
        directionalLight.position.set(3.5, 2, - 1.25)
        this.scene.add(directionalLight)

        if (this.gui.isActive) {
            this.lightDebug = this.gui.gui.addFolder("Directional Light");
            this.lightDebug.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
            this.lightDebug.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('lightX')
            this.lightDebug.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('lightY')
            this.lightDebug.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('lightZ')
        }
    }

    setEnvMap() {
        // this.scene.background = this.resources.envMap;
        this.scene.environment = this.resources.envMap;
        this.scene.environmentIntensity = 0.4;

        if (this.gui.isActive) {
            this.envMapDebug = this.gui.gui.addFolder("Env Map");
            this.envMapDebug.add(this.scene, "environmentIntensity").name("EnvMapIntensity").min(0).max(4).step(0.001);
        }
    }
}