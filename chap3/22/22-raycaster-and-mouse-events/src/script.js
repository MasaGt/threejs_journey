import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#00ff00' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#0000ff' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

//オブジェクトの座標を更新
// scene.updateMatrixWorld();
object1.updateMatrixWorld();
object2.updateMatrixWorld();
object3.updateMatrixWorld();

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(1, 0, 0);
raycaster.set(rayOrigin, rayDirection);

// console.log(raycaster.intersectObject(object1));
// console.log(raycaster.intersectObjects([object1, object2, object3]));
const targets = [object1, object2, object3];
let hitObjects = raycaster.intersectObjects(targets);

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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update Meshes
    object1.position.y = Math.sin(elapsedTime);
    object2.position.y = Math.sin(elapsedTime * 0.7) * 1.3;
    object3.position.y = Math.sin(elapsedTime * 0.4) * 1.6;

    //rayにヒットしていないオブジェクトは元の色のままにしておくための処理
    object1.material.color.set("#ff0000");
    object2.material.color.set("#00ff00");
    object3.material.color.set("#0000ff");

    //Cast a ray
    hitObjects = raycaster.intersectObjects(targets);
    if (hitObjects.length > 0) {
        for (const obj of hitObjects) {
            obj.object.material.color.set("#FFE500");
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()