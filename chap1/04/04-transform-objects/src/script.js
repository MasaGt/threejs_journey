import * as THREE from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Axes Helper
 */

const helper = new THREE.AxesHelper(2);
// scene.add(helper);

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
mesh.add(helper);

//Position
// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
mesh.position.set(0.7, -0.6, 1);

// Scale
mesh.scale.x = 0.5;
mesh.scale.y = 0.7;
mesh.scale.z = 1.2;

scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);