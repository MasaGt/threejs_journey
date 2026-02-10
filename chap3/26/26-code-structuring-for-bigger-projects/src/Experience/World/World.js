/**
 * 
 */

import { Environment } from "./Environment";
import { Resources } from "../Utils/Resources";
import { Floor } from "./Floor";
import { Fox } from "./Fox";

export class World {

    constructor(scene, gui) {
        this.scene = scene;
        this.resources = new Resources();
        this.gui = gui;
        this.resources.on("ready", () => {
            this.floor = new Floor(this.scene, this.resources);
            this.fox = new Fox(this.scene, this.resources, this.gui);
            this.environment = new Environment(this.scene, this.gui, this.resources);
        });
        this.resources.loadResources(); // ★リソースのロードが早すぎると、後続のon("ready")でリッスンするよりも早く"ready"を発火することがあるので、on("ready")の後でロードを開始している
    }

    update(timer) {
        if (this.fox) {
            this.fox.update(timer);
        }
    }
}