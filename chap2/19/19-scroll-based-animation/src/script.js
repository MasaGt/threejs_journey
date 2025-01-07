import * as THREE from "three";
import GUI from "lil-gui";

/**
 * Debug
 */
const gui = new GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange((val) => {
  parameters.materialColor = val;
  material.color.set(val);
  particles.material.color.set(val);
});

/**
 * Textures
 */
const loader = new THREE.TextureLoader();
const gradientMap = loader.load("./textures/gradients/3.jpg");
// setting for using gradient map
gradientMap.minFilter = THREE.NearestFilter;
gradientMap.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
// material
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
});
material.gradientMap = gradientMap;

const objectDistance = 4;

const obj1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const obj2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const obj3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

obj1.position.y = -objectDistance * 0;
obj1.position.x = 2;
obj2.position.y = -objectDistance * 1;
obj2.position.x = -2;
obj3.position.y = -objectDistance * 2;
obj3.position.x = 2;

scene.add(obj1, obj2, obj3);

const sectionMeshes = [obj1, obj2, obj3]; //参照用の配列

/**
 * Particles
 */
// Geometry
const particleNum = 200;
const particlePosition = new Float32Array(particleNum * 3);

for (let i = 0; i < particleNum; i++) {
  particlePosition[i * 3 + 0] = (Math.random() - 0.5) * 10; // x座標
  particlePosition[i * 3 + 1] =
    -(Math.random() * objectDistance * sectionMeshes.length) +
    objectDistance * 0.5; // y座標
  particlePosition[i * 3 + 2] = (Math.random() - 0.5) * 10; // z座標
}

const buffereAttribute = new THREE.BufferAttribute(particlePosition, 3);
const bufferGeometry = new THREE.BufferGeometry().setAttribute(
  "position",
  buffereAttribute
);

const particles = new THREE.Points(
  bufferGeometry,
  new THREE.PointsMaterial({
    size: 0.5,
    color: parameters.materialColor,
    sizeAttenuation: true,
  })
);

scene.add(particles);

/**
 * Lights
 */
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(1, 1, 0);
scene.add(light);

/**
 * Sizes & Cursor
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const cursor = {
  y: 0,
  x: 0,
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

window.addEventListener("mousemove", (e) => {
  cursor.y = -(e.clientY / sizes.height - 0.5);
  cursor.x = e.clientX / sizes.width - 0.5;
  // camera.position.x = cursor.x;
  // camera.position.y = cursor.y;
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;

// Camera Group
const cameraGroup = new THREE.Group();
cameraGroup.add(camera);
scene.add(cameraGroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

renderer.setClearAlpha(0.5);
renderer.setClearAlpha(0.5);
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */
// window.addEventListener("scroll", () => {
//   cameraGroup.position.y = -(window.scrollY / sizes.height) * objectDistance;
// });

console.log(window.innerHeight);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sectionMeshes.forEach((mesh) => {
    // mesh.rotation.y = elapsedTime * 0.1;
    // mesh.rotation.x = elapsedTime * 0.15;
  });

  // move camera group according to scroll
  cameraGroup.position.y = -(window.scrollY / sizes.height) * objectDistance;

  // move camera according to mousemove
  camera.position.x += (cursor.x - camera.position.x) * 0.01;
  camera.position.y += (cursor.y - camera.position.y) * 0.01;
  sectionMeshes.forEach((mesh) => {
    // mesh.position.x += cursor.x * 0.01;
    // mesh.position.y += cursor.y * 0.01;
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
