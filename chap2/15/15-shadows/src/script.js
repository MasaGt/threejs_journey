import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.width = 2048;
// directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.mapSize.width = 512 / 2;
directionalLight.shadow.mapSize.height = 512 / 2;
// console.log(directionalLight.shadow);
gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
// scene.add(directionalLight);

// Light camera optimization
// directionalLight.shadow.camera.far = 5;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.top = 1.5;
directionalLight.shadow.camera.bottom = -3;
directionalLight.shadow.camera.right = 3.5;
directionalLight.shadow.camera.left = -3;

// blurring directional shadow
// directionalLight.shadow.radius = 10;

// directional camera helper
// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

// Direcitional Light camera Debug
// const cameraDebug = gui.addFolder("Directional Light Camera");
// const updateLightCamera = () => {
//   directionalLight.shadow.camera.updateProjectionMatrix();
//   cameraHelper.update();
// };

// cameraDebug
//   .add(directionalLight.shadow.camera, "near")
//   .min(-10)
//   .max(10)
//   .onChange(() => {
//     updateLightCamera();
//   });

// cameraDebug
//   .add(directionalLight.shadow.camera, "far")
//   .min(0)
//   .max(100)
//   .onChange(() => {
//     updateLightCamera();
//   });

// cameraDebug
//   .add(directionalLight.shadow.camera, "top")
//   .min(-10)
//   .max(10)
//   .onChange(() => {
//     updateLightCamera();
//   });

// cameraDebug
//   .add(directionalLight.shadow.camera, "bottom")
//   .min(-10)
//   .max(0)
//   .onChange(() => {
//     updateLightCamera();
//   });

// cameraDebug
//   .add(directionalLight.shadow.camera, "right")
//   .min(0)
//   .max(10)
//   .onChange(() => {
//     updateLightCamera();
//   });

// cameraDebug
//   .add(directionalLight.shadow.camera, "left")
//   .min(-10)
//   .max(0)
//   .onChange(() => {
//     updateLightCamera();
//   });

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 4);
spotLight.penumbra = 0;
spotLight.decay = 0;
spotLight.angle = Math.PI * 0.1;
spotLight.castShadow = true;
spotLight.updateMatrix();
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
spotLight.shadow.camera.fov = spotLight.angle;
console.log(spotLight.shadow.camera.fov);
// spotLight.shadow.camera.far = 4.5;

// Spot Light Camera Helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

// spot light camera debug
const spotLightCameraDebug = gui.addFolder("Spot Light Camera");
const updateSpotLightCamera = () => {
  spotLight.shadow.camera.updateProjectionMatrix();
  spotLight.updateProjectionMatrix();
  spotLightCameraHelper.update();
};

spotLightCameraDebug
  .add(spotLight.shadow.camera, "near")
  .min(-10)
  .max(10)
  .onChange(() => {
    updateSpotLightCamera();
  });

spotLightCameraDebug
  .add(spotLight.shadow.camera, "far")
  .min(-10)
  .max(500)
  .onChange(() => {
    updateSpotLightCamera();
  });

spotLightCameraDebug
  .add(spotLight.shadow.camera, "fov")
  .min(0)
  .max(Math.PI * 0.5)
  .step(0.01)
  .onChange((v) => {
    spotLight.angle = v;
    console.log(spotLight.shadow.camera.fov);
    updateSpotLightCamera();
  });

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;

// Material Debug
const materialDebug = gui.addFolder("Material");
materialDebug.add(material, "metalness").min(0).max(1).step(0.001);
materialDebug.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

scene.add(sphere, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// shadow config
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();