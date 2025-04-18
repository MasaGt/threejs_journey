/**
 * applyForce系メソッドとapplyImpuls系メソッドの違いを比較するためのコード
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import * as CANNON from "cannon-es"; // ★import cannon-es

/**
 * Debug
 */
const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * axis helper
 */

const axesHelper = new THREE.AxesHelper(5);

// シーンに追加
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Physics
 */
// world
const world = new CANNON.World();
// world.gravity = new CANNON.Vec3(0, -9.82, 0);

// Materials
const rubberMaterial = new CANNON.Material("rubber");
rubberMaterial.friction = 0.2;
rubberMaterial.restitution = 0.9;

const plasticMaterial = new CANNON.Material({
  name: "plastic",
  friction: 0.4,
  restitution: 0.6,
});

const rubberPLasticContactMaterial = new CANNON.ContactMaterial(
  rubberMaterial,
  plasticMaterial,
  {
    restitution: 0.1,
  }
);
world.addContactMaterial(rubberPLasticContactMaterial);

// Bodies
// Sphere1
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
  material: rubberMaterial,
});
// ★★★力を作用(applyLocalForce)★★★
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0,0,0))
// sphereBody.applyLocalImpulse(new CANNON.Vec3(15, 0, 0), new CANNON.Vec3(0,0,0))
// ★★★力を作用(applyForce)★★★
// sphereBody.applyForce(new CANNON.Vec3(100, 0, 0), new CANNON.Vec3(0,0,0))
// world.addBody(sphereBody);

// Sphere2
const sphereShape2 = new CANNON.Sphere(0.5);
const sphereBody2 = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(3, 3, 3),
  shape: sphereShape2,
  material: rubberMaterial,
});
world.addBody(sphereBody2);

/**
 * 力のシミュレーション
 */
const debug = {
  applyImplus: () => {
    const force = new CANNON.Vec3(-3, -3, -3);
    const point = new CANNON.Vec3(0, 0, 0);
    sphereBody2.applyImpulse(force, point);
  },
  applyLocalImpuls: () => {
    const force = new CANNON.Vec3(-3, -3, -3);
    const point = new CANNON.Vec3(0, 0, 0);
    sphereBody2.applyLocalImpulse(force, point);
  }
}
gui.add(debug, "applyImplus");
gui.add(debug, "applyLocalImpuls");

// Plane
const planeBody = new CANNON.Body({
  mass: 0,
  shape: new CANNON.Plane(),
  material: plasticMaterial,
});
planeBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0);
world.addBody(planeBody);

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
sphere.castShadow = true;
sphere.position.copy(sphereBody.position);
// scene.add(sphere);

const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
sphere2.castShadow = true;
sphere2.position.copy(sphereBody2.position);
scene.add(sphere2);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Update Physics World
  world.step(1 / 60, delta, 10);

  // 物理空間の計算結果を Three.js のオブジェクトに合わせる
  // sphere.position.copy(sphereBody.position);
  sphere2.position.copy(sphereBody2.position);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
