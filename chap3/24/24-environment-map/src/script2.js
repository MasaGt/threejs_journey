// CubeCameraを使う練習のコード
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
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
 * DracoLoader & GLTFLoader
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  const model = gltf.scene;
  model.translateX(3);
  model.scale.set(10, 10, 10);
  model.traverse((obj) => {
  obj.layers.enable(1);
});
  scene.add(model);
});

/**
 * Textures
 */
// パノラママップ (HDR)
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/fantasy_lands_castles_at_night.jpg",
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
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0,
    metalness: 1,
    color: 0xaaaaaa,
  })
);
torusKnot.position.y = 4;
scene.add(torusKnot);

/**
 * Torus
 */
const donut = new THREE.Mesh(
  new THREE.TorusGeometry(8, 0.5),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(100,100,100) })
);
donut.position.y = 2;
donut.position.x = 1.5;
donut.layers.enable(1);
scene.add(donut);

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

/**
 * CubeCamera
 * キューブカメラの利用
 */
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeRenderTarget.texture.mapping = THREE.CubeReflectionMapping 
scene.environment = cubeRenderTarget.texture;
cubeCamera.layers.set(1);

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
  100
);
camera.position.set(4, 5, 4);
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

  // rotate donut
  if (donut) {
    donut.rotation.x += Math.sin(delta);
    if (donut.rotation.x> Math.PI * 2) {
      donut.rotation.x = 0;
    }
  }

  // Update キューブカメラ
  cubeCamera.update(renderer, scene);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
