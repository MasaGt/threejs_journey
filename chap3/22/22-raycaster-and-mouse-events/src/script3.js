// Import 3D model
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
 * Loaders
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
let model = null;
let modelCopy = null;
gltfLoader.load(
    "/models/Duck/glTF-Draco/Duck.gltf",
    (gltf) => {
        model = gltf.scene;
        modelCopy = model.clone();
        scene.add(model);
    }
);

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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
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
 * mouse event
 */
let pointer = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
    let x = ((e.clientX / window.innerWidth) * 2) - 1;
    let y = - (e.clientY / window.innerHeight * 2 - 1);

    pointer.set(x, y);
});

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

//click
let hitObject = [];
window.addEventListener('click', (e) => {
    if (hitObject.length > 0) {
        // console.log(model)
        const children = [...model.children[0].children]
        for (const child of children) {
            if (child.isMesh) {
                child.material.color.set("#ff0000");
            }
        }
    }
});


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //cast a ray
    raycaster.setFromCamera(pointer, camera);
    if (model !== null) {
        hitObject = raycaster.intersectObject(model);
    }
    // if (model) {
    //     hitObject = raycaster.intersectObject(model);
    //     model.scale.set(1,1,1);
    //     if (hitObject.length > 0) {
    //         model.scale.set(2, 2, 2);
    //     }
    // }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()