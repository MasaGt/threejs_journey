import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  //   cursor.x = e.clientX / sizes.width - 0.5;
  //   cursor.y = -(e.clientY / sizes.height - 0.5);
  //   cursor.y = e.clientY / sizes.height - 0.5;
});

/**
 * Axes Helper
 */
const helper = new THREE.AxesHelper(2);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Scene
const scene = new THREE.Scene();
scene.add(helper);

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
mesh.position.set(1, 1, 1);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(mesh.position);
scene.add(camera);

// Camera Controls
const orbitControl = new OrbitControls(camera, canvas);
orbitControl.enableDamping = true;
orbitControl.target = mesh.position;

scene.add(helper);
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

const tick = () => {
  // Update objects
  //   mesh.rotation.y = elapsedTime;

  // Update Camera
  //   camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  //   camera.position.y = cursor.y * 3;
  //   camera.lookAt(mesh.position);

  orbitControl.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
