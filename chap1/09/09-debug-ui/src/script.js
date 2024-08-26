import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import GUI from "lil-gui";

/**
 * Debug GUI
 */
const gui = new GUI({ title: "new title!", closeFolders: true });

const meshTweak = gui.addFolder("mesh");
const materialTweak = gui.addFolder("material");
const geometryTweak = gui.addFolder("geometry");
const debugObj = {
  color: "#ff0000",
};
window.addEventListener("keydown", (e) => {
  if (e.key == "h") {
    gui.show(gui._hidden);
  }
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: debugObj.color });
// material.wireframe = true;
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
// gui.title("Test");
// gui.add(mesh.position, "y").min(-5).max(5);
// gui.add(mesh.position, "x").min(-3).max(4);
// gui.add(mesh.position, "z").min(-3).max(4);
// gui
//   .add(mesh.rotation, "y")
//   .min(-Math.PI * 2)
//   .max(Math.PI * 2);
meshTweak.add(mesh.position, "y");

// boolean props
// gui.add(mesh, "visible");
// gui.add(material, "wireframe");
materialTweak.add(material, "wireframe");

// manipulation
// const manipulationObj = {
//   revolution: () => {
//     gsap.to(mesh.rotation, {
//       duration: 1,
//       y: mesh.rotation.y + Math.PI * 2,
//     });
//   },
// };

// gui.add(manipulationObj, "revolution");

// tweak color
// gui.addColor(debugObj, "color").onChange((v) => {
//   material.color.set(debugObj.color);
// });

// tweak geometry
const geometryObj = {
  widthSegment: 2,
  heightSegment: 2,
  depthSegment: 2,
};
geometryTweak
  .add(geometryObj, "widthSegment")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange((v) => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, v, 2, 2);
  });
// gui
//   .add(geometryObj, "widthSegment")
//   .min(1)
//   .max(10)
//   .step(1)
//   .onFinishChange((v) => {
//     mesh.geometry.dispose();
//     mesh.geometry = new THREE.BoxGeometry(1, 1, 1, v, 2, 2);
//   });

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
