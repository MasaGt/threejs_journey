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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const alpha1 = textureLoader.load("./textures/particles/1.png");
const alpha2 = textureLoader.load("./textures/particles/2.png");
const alpha3 = textureLoader.load("./textures/particles/3.png");
const alpha4 = textureLoader.load("./textures/particles/4.png");
const alpha5 = textureLoader.load("./textures/particles/5.png");
const alpha6 = textureLoader.load("./textures/particles/6.png");
const alpha7 = textureLoader.load("./textures/particles/7.png");
const alpha8 = textureLoader.load("./textures/particles/8.png");
const alpha9 = textureLoader.load("./textures/particles/9.png");
const alpha10 = textureLoader.load("./textures/particles/10.png");
const alpha11 = textureLoader.load("./textures/particles/11.png");
const alpha12 = textureLoader.load("./textures/particles/12.png");
const alpha13 = textureLoader.load("./textures/particles/13.png");

/**
 * Particles
 */
// ↓ビルトインジオメトリの利用
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);
// const particlesGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
// const particlesGeometry = new THREE.BoxGeometry(1, 1, 1);

// ↓練習
// const vertecies = new Float32Array(3);
// const vertecies = new Float32Array(9);
// vertecies[0] = 0;
// vertecies[1] = 0;
// vertecies[2] = 0;
// vertecies[3] = 1;
// vertecies[4] = 1;
// vertecies[5] = 0;
// vertecies[6] = 1;
// vertecies[7] = 0;
// vertecies[8] = 0;

// Three.jsのレッスン通り
const numVertecies = 500;
const vertecies = new Float32Array(numVertecies * 3);
const colorVertecies = new Float32Array(numVertecies * 3);

for (let i = 0; i < vertecies.length; i++) {
  vertecies[i] = (Math.random() - 0.5) * 10;
  // colorVertecies[i] = Math.random() * 255; //これは正しくない
  colorVertecies[i] = Math.random();
}

const bufferAttribute = new THREE.BufferAttribute(vertecies, 3);
const colorBufferAttribute = new THREE.BufferAttribute(colorVertecies, 3);

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute("position", bufferAttribute);
particlesGeometry.setAttribute("color", colorBufferAttribute);

const particleMaterial = new THREE.PointsMaterial({
  //   color: 0xff88cc,
  //   size: 0.02,
  //   sizeAttenuation: false,
  size: 0.5,
  sizeAttenuation: true,
  // transparent: true,
  // alphaMap: alpha5,
  // alphaTest: 0.5,
});
// particleMaterial.depthTest = false;
// particleMaterial.depthWrite = false;
particleMaterial.vertexColors = true;
const particle = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particle);

// Cube
// scene.add(
//   new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ wireframe: true })
//   )
// );

// Particle Debug
const particleDebug = gui.addFolder("Particle");
particleDebug.add(particleMaterial, "size").min(0).max(5).step(0.01);
particleDebug.add(particleMaterial, "sizeAttenuation").onChange(() => {
  particleMaterial.needsUpdate = true;
});

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
camera.position.z = 3;
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
