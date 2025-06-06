import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/// Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * DracoLoader & GLTFLoader
 */

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

const gltfLoader = new GLTFLoader();
// gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
    "/models/FlightHelmet/glTF/FlightHelmet.gltf",
    (gltf) => {
        const model = gltf.scene;
        model.translateX(3);
        model.scale.set(10,10,10);
        scene.add(model);
    }
);

/**
 * Textures
 */
// キューブマップ
// const cubeTextureLoader = new THREE.CubeTextureLoader;
// const basePath = "/environmentMaps/0/";
// const cubeMap = cubeTextureLoader.load([
//     `${basePath}px.png`,
//     `${basePath}nx.png`,
//     `${basePath}py.png`,
//     `${basePath}ny.png`,
//     `${basePath}pz.png`,
//     `${basePath}nz.png`
// ]);
// //シーンの背景に環境マップを適用
// scene.background = cubeMap;
// //シーン内の全てのオブジェクトに環境マップ(反射マッピング)を適用
// scene.environment = cubeMap;

// パノラママップ
const hdrLoader = new RGBELoader();
hdrLoader.load(
    "/environmentMaps/0/2k.hdr",
    (envMap) => {
        envMap.mapping = THREE.EquirectangularRefractionMapping;
        scene.environment = envMap;
        scene.background = envMap;
        scene.backgroundRotation.y = Math.PI;
    }
);

/**
 * Debug
 */
gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
gui.add(scene.backgroundRotation, "y").min(0).max(Math.PI * 2).step(0.001).name("backgroundRotationY");
gui.add(scene.environmentRotation, "y").min(0).max(Math.PI * 2).step(0.001).name("environmentRotationY");
gui.add(scene.backgroundRotation, "x").min(0).max(Math.PI * 2).step(0.001).name("backgroundRotationX");
gui.add(scene.environmentRotation, "x").min(0).max(Math.PI * 2).step(0.001).name("environmentRotationX");
gui.add(scene.backgroundRotation, "z").min(0).max(Math.PI * 2).step(0.001).name("backgroundRotationZ");
gui.add(scene.environmentRotation, "z").min(0).max(Math.PI * 2).step(0.001).name("environmentRotationZ");

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
    new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 1,
        color: 0xaaaaaa,
    })
)
torusKnot.position.y = 4
scene.add(torusKnot)

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
 * Light
 */

// const ambientLight = new THREE.AmbientLight("#ffffff", 10);
// scene.add(ambientLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()