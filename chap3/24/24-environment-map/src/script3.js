// CubeRenderTargetのtype確認用コード
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

/// Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

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
    // scene.environment = envMap;
  }
);

/**
 * Objects
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry( 10, 32, 16 ),
  new THREE.MeshStandardMaterial({
    roughness: 0.05,
    metalness: 1,
    color: 0xff0000,
  })
);
scene.add(sphere);
// sphere.layers.enable(1);
sphere.layers.set(2);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry( 15, 15, 15 ),
  // new THREE.MeshBasicMaterial( {
  new THREE.MeshStandardMaterial( {
  // color: new THREE.Color(1,1,1)
  // color: new THREE.Color(100,100,100)
  color: 0x00ff00
} )
);
cube.position.y = 30;
scene.add( cube );
// cube.layers.enable(2);
cube.layers.set(3);

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
const cubeCamera = new THREE.CubeCamera(10, 100, cubeRenderTarget);
cubeRenderTarget.texture.mapping = THREE.CubeReflectionMapping 
scene.environment = cubeRenderTarget.texture;

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
camera.position.set(40, 34, 40);
// camera.position.set(20, 19, 20);
scene.add(camera);
// camera.layers.enable(1);
camera.layers.set(1);
camera.layers.enable(2);
camera.layers.enable(3);

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
