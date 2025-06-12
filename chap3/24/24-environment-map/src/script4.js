// CubeCameraを使う練習のコード
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/// Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * Textures
 */
// パノラママップ (HDR)
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
  (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
  }
);

/**
 * Debug
 */
gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);
gui
  .add(scene.backgroundRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("backgroundRotationY");
gui
  .add(scene.environmentRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("environmentRotationY");
gui
  .add(scene.backgroundRotation, "x")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("backgroundRotationX");
gui
  .add(scene.environmentRotation, "x")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("environmentRotationX");
gui
  .add(scene.backgroundRotation, "z")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("backgroundRotationZ");
gui
  .add(scene.environmentRotation, "z")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("environmentRotationZ");

/**
 * cube render target
 * = キューブテクスチャを保存するためのインスタンス
 */
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  256,
  {
    type: THREE.HalfFloatType
  }
);
const cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget(
  256,
  {
    type: THREE.HalfFloatType
  }
);

/**
 * CubeCamera
 * キューブカメラの利用
 */
const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
cubeRenderTarget.texture.mapping = THREE.CubeReflectionMapping 

const cubeCamera2 = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget2);
cubeRenderTarget2.texture.mapping = THREE.CubeReflectionMapping 

/**
 * Object
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry( 10, 32, 16 ),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xffffff,
    envMap: cubeRenderTarget.texture
  })
);
sphere.position.set(-20, 0, 0);
cubeCamera.position.copy(sphere.position);
scene.add(sphere);

const box = new THREE.Mesh(
  new THREE.BoxGeometry( 10, 10, 10),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xffffff,
    envMap: cubeRenderTarget2.texture
  })
);
box.position.set(20, 0, 0);
cubeCamera2.position.copy(box.position);
scene.add(box);

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
 * Light
 */

// const ambientLight = new THREE.AmbientLight("#ffffff", 10);
// scene.add(ambientLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(30, 25, 30);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
// controls.target.y = 3.5
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previsouTime = 0;

const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - previsouTime;
  previsouTime = elapsedTime;

  // Update キューブカメラ
  cubeCamera.update(renderer, scene);
  cubeCamera2.update(renderer, scene);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
