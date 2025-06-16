// ハンバーガーモデルを取り込むコード
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * Loaders
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
const rgbeLoader = new RGBELoader();

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// AxisHelper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh)
        {
            // Activate shadow here
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}

/**
 * Environment map
 */
// Intensity
scene.environmentIntensity = 1
gui
    .add(scene, 'environmentIntensity')
    .min(0)
    .max(10)
    .step(0.001);

// HDR (RGBE) equirectangular
rgbeLoader.load('/environmentMaps/0/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
});

const textureLoader = new THREE.TextureLoader();
const floorArmTexture = textureLoader.load("/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg");
const floorNormalTexture = textureLoader.load("/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png");
const floorColorTexture = textureLoader.load("/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg");
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallArmTexture = textureLoader.load("/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg");
const wallNormalTexture = textureLoader.load("/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png");
const wallColorTexture = textureLoader.load("/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg");
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Models
 */
// Hamburger
gltfLoader.load(
    '/models/myModel/hamburger.glb',
    // '/models/hamburger.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(0.5, 0.5, 0.5); //ハンバーガー用
        gltf.scene.position.y = -0.5;
        scene.add(gltf.scene)
        updateAllMaterials()
    }
)

/**
 * Objects
 */
// const planeGeometry = new THREE.PlaneGeometry(8, 8, 10, 10)
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
        color: "gray"
    })
);
floor.rotateX(-Math.PI*0.5)
scene.add(floor);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 6);
directionalLight.castShadow = true;
// shaow acneをシャドウマップのテクセルサイズの変更で消せるかどうかの実験
// directionalLight.shadow.mapSize.set(1024,1024);

directionalLight.position.set(0, 6, 6);
directionalLight.target.position.set(0, 4, 0);
directionalLight.target.updateMatrixWorld();
// scene.add(directionalLight.target);
scene.add(directionalLight);

// Light Debug
gui.add(directionalLight, "intensity").min(0).max(10).step(0.01);
gui.add(directionalLight.position, "x").min(-10).max(10).step(0.01);
gui.add(directionalLight.position, "y").min(-10).max(10).step(0.01);
gui.add(directionalLight.position, "z").min(-10).max(10).step(0.01);
gui.add(directionalLight.shadow, 'normalBias').min(- 50).max(50).step(0.1)
gui.add(directionalLight.shadow, 'bias').min(- 50).max(50).step(0.001)

// Light Camera
const lightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// lightCameraHelper.update();
scene.add(lightCameraHelper)

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
camera.position.set(3, 4, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Tone Mapping
 */

// renderer.toneMapping = THREE.ACESFilmicToneMapping;

/**
 * debug
 */
gui.add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
});
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()