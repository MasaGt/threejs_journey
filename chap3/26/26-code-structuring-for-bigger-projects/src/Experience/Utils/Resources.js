/**
 * テクスチャを管理するクラス
 */
import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import { sources } from "../sources";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class Resources extends EventEmitter {

    constructor() {
        super();
        this.textureLoader = new THREE.TextureLoader();
        this.gltfLoader = new GLTFLoader();
        this.cubeTextureLoader = new THREE.CubeTextureLoader();
        this.envMap;
        this.textures = {};
        this.model;
        this.itemNum = sources.length;
        this.loadedNum = 0;
    }

    loadResources() {
        for (const resource of sources) {
            if (resource.type === "gltfModel") {
                this.load3DModel(resource.path);
            } else if (resource.type === "cubeTexture") {
                this.loadCubeMapTexture(resource.path);
            } else if (resource.type === "texture") {
                this.loadTexture(resource.path, resource.name);
            }
        }
    }

    loadCubeMapTexture(path) {
        this.cubeTextureLoader.load(path, (envMap) => {
            this.envMap = envMap;
            this.checkReady();
        });
    }
    
    load3DModel(path) {
        this.gltfLoader.load(path, (gltf) => {
            this.model = gltf;
            this.checkReady();
        });
    }
    
    loadTexture(path, name) {
        this.textureLoader.load(path, (texture) => {
            this.textures[name] = texture;
            this.checkReady();
        });
    }

    checkReady() {
        this.loadedNum++;
        if (this.itemNum == this.loadedNum) {
            //emit finish event
            this.trigger("ready");
        }
    }
}