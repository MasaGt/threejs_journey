import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * 3D Model Loaders
 */
const gltfLoader = new GLTFLoader();

//Dracoloader
const dracoLoader = new DRACOLoader();

//アヒルのモデルの取り込み
gltfLoader.load(
    "/models/Duck/glTF/Duck.gltf",
    // "/models/Duck/glTF-Binary/Duck.glb", //GLB形式
    // "/models/Duck/glTF-Draco/Duck.gltf", //Draco圧縮形式 (★エラーになるので注意)
    // "/models/Duck/glTF-Embedded/Duck.gltf", //Embedded形式
    (gltf) => {
        /**
         * パーツを1つづつシーンに追加する方法
         */
        // const meshes = [...gltf.scene.children[0].children];
        // for (const obj of meshes) {
        //     obj.scale.set(0.025,0.025,0.025);
        //     scene.add(obj);
        // }

        /**
         * 3Dモデルを丸ごとシーンに追加する方法
         */
        scene.add(gltf.scene);
    }
);

/**
 * Draco圧縮されたアヒルのモデルの取り込み
 */

//ローカルの DRACOデコーダーを指定する場合
dracoLoader.setDecoderPath("/draco/");
//CDN上のDRACOデコーダーを指定する場合
// dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
    "/models/Duck/glTF-Draco/Duck.gltf",
    (gltf) => {
        //非Draco圧縮の3Dモデルとの違いがわかりやすいように色を変えてみる
        const objs = [...gltf.scene.children[0].children]
        for (const obj of objs) {
            if (obj.isMesh) {
                obj.material.color = new THREE.Color(0xff0000);
            }
        }

        //非Draco圧縮の3Dモデルとの違いがわかりやすいように移動&回転させてみる
        gltf.scene.translateX(-2);
        gltf.scene.rotateY(Math.PI);
        scene.add(gltf.scene);
    }
);

//ヘルメットのモデルの取り込み
gltfLoader.load(
    "/models/FlightHelmet/glTF/FlightHelmet.gltf",
    (gltf) => {
        /**
         * パーツを1つづつシーンに追加する方法
         */
        // const meshes = [...gltf.scene.children];
        // for (const mesh of meshes) {
        //     mesh.translateX(2);
        //     scene.add(mesh);
        // }
        
        //カラー空間の指定
        // for (const mesh of gltf.scene.children) {
            // if (mesh.isMesh) {
            //     mesh.material.map.encoding = THREE.sRGBEncoding
            // }
        // }

        /**
         * 3Dモデルを丸ごとシーンに追加する方法
         */
        gltf.scene.position.set(2, 0, 0); //もしくは gltf.scene.translateX(2);
        scene.add(gltf.scene);
    }
);

let animationMixer = null;

//キツネのモデルの取り込み
gltfLoader.load(
    // "/models/Fox/glTF/Fox.gltf",
    "/models/Fox/glTF-Binary/Fox.glb",
    // "/models/Fox/glTF-Embedded/Fox.gltf",
    (gltf) => {
        //AnimationMixerインスタンスの作成
        animationMixer = new THREE.AnimationMixer(gltf.scene);

        //AnimationMixerとAnimationClipからAnimationActionの作成
        const animationAction = animationMixer.clipAction(gltf.animations[2]);

        //キーフレームアニメーションの再生
        animationAction.play();

        //取り込んだ3Dモデルをシーンに追加
        gltf.scene.scale.set(0.025, 0.025, 0.025);
        gltf.scene.position.set(0, 0, 3);
        scene.add(gltf.scene);
    }
);


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
//レンダラー自体のカラースペースの指定
// renderer.outputEncoding = THREE.sRGBEncoding

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update Animation
    if (animationMixer) {
        animationMixer.update(deltaTime);
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()