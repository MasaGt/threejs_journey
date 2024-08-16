import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// ---- Delta Time Solution ----
// let time = Date.now();
// ---- Delta Time Solution ----

// ---- Clock Solution ----
// const clock = new THREE.Clock();

// GSAP Solution
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, z: 1, y: 1 });

// Animations
const tick = () => {
  // ---- Delta Time Solution ----
  //   let current = Date.now();
  //   let delta = current - time;
  //   time = current;
  // Move Object
  //   mesh.position.x += 0.0008 * delta;
  // Rotate Object
  //   mesh.rotation.y += 0.001 * delta;
  // ---- Delta Time Solution ----

  // ---- Clock Solution ----
  //   const elapsedTime = clock.getElapsedTime();
  // One rotation (360 degree) per 1 second
  // mesh.rotation.y = elapsedTime * Math.PI * 2;
  // ---- Clock Solution ----

  //Render
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

requestAnimationFrame(tick);
