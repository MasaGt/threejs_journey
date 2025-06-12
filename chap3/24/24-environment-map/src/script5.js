// GroundedSkyboxを使う練習のコード
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GroundedSkybox }from "three/addons/objects/GroundedSkybox.js";
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
let model;
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  model = gltf.scene;
  model.scale.set(10, 10, 10);
  scene.add(model);
});

/**
 * Textures
 */
// パノラママップ (jpeg)
const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  "/environmentMaps/blockadesLabsSkybox/scifi_white_sky_scrapers_in_clouds_at_day_time.jpg",
  (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // scene.background = envMap;
    scene.environment = envMap;
    const skybox = new GroundedSkybox(envMap, 10, 30);
    skybox.position.y = 10;
    console.log(skybox)
    // skybox.material.wireframe = true;
    scene.add(skybox);
  }
);

//パノラママップ (hdr)
// const rgbeLoader = new RGBELoader();
// rgbeLoader.load(
//   "/environmentMaps/0/2k.hdr",
//   (envMap) => {
//     envMap.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = envMap;
//     const skybox = new GroundedSkybox(envMap, 10, 30);
//     skybox.position.y = 10;
//     scene.add(skybox);
//   }
// );

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

  gui.close();

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
  3000
);
camera.position.set(0, 5, 15);
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
  
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
