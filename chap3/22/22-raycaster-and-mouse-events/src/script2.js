// Use Raycaster.setFromCamera
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
let targets = [object1, object2, object3];
let lastIntersect = null;

//click
window.addEventListener('click', (e) => {
    if (lastIntersect !== null) {
        switch (lastIntersect.object) {
            case object1:
                console.log("click object1");
                break;
            case object2:
                console.log("click object2");
                break;
            case object3:
                console.log("click object3");
                break;
        
            default:
                break;
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

    //Update Meshes
    object1.position.y = Math.sin(elapsedTime);
    object2.position.y = Math.sin(elapsedTime * 0.7) * 1.3;
    object3.position.y = Math.sin(elapsedTime * 0.4) * 1.6;

    //rayにヒットしていないオブジェクトは元の色のままにしておくための処理
    object1.material.color.set("#ff0000");
    object2.material.color.set("#00ff00");
    object3.material.color.set("#0000ff");

    //Cast a ray
    raycaster.setFromCamera( pointer, camera );
    const hitObjects = raycaster.intersectObjects(targets);
    if (hitObjects.length > 0) {
        for (const obj of hitObjects) {
            obj.object.material.color.set("#FFE500");
        }
    }

    if (hitObjects.length > 0) {
        //rayがオブジェクトと交差している
        if (lastIntersect === null) {
            //enter
            console.log("mouseEnter");
        } else {
            //hover
            console.log("mouseHover");
        }
        lastIntersect = hitObjects[0];
    } else {
        //rayがオブジェクトと交差していない
        if (lastIntersect !== null) {
            //leave
            console.log("mouseLeave");
        }
        lastIntersect = null;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()