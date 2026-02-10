/**
 * Floorメッシュ
 */

import * as THREE from "three";

export class Floor {

    constructor(scene, resources) {
        this.scene = scene;
        this.resources = resources;

        // ★createFloor()のように1つのメソッドにまとめた方がいいと思うが、Three.js Journey に従って複数のメソッドに分けている
        this.setGeometry();
        this.setTexture();
        this.setMaterial();
        this.setMesh();
        this.scene.add(this.mesh);
    }

    setGeometry() {
        this.geometry = new THREE.CircleGeometry(5, 64);
    }

    setTexture() {
        this.textures = {};
        this.textures.color = this.resources.textures.grassColorTexture;
        this.textures.color.colorSpace = THREE.SRGBColorSpace;
        this.textures.color.repeat.set(1.5, 1.5);
        this.textures.color.wrapS = THREE.RepeatWrapping;
        this.textures.color.wrapT = THREE.RepeatWrapping;
        
        this.textures.normal = this.resources.textures.grassNormalTexture;
        this.textures.normal.repeat.set(1.5, 1.5);
        this.textures.normal.wrapS = THREE.RepeatWrapping;
        this.textures.normal.wrapT = THREE.RepeatWrapping;
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotateX(-Math.PI * 0.5);
        this.mesh.receiveShadow = true;
    }
}