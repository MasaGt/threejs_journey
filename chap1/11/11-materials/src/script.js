import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

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
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

loadingManager.onError = (v) => {
  console.log(`Loading Error: ${v}`);
};

// door textures
const textureLoader = new THREE.TextureLoader(loadingManager);
const alphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const ambientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const colorTexture = textureLoader.load("./textures/door/color.jpg");
colorTexture.colorSpace = THREE.SRGBColorSpace;
const heightTexture = textureLoader.load("./textures/door/height.jpg");
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
const normalTexture = textureLoader.load("./textures/door/normal.jpg");
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");

// gradietns textures
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg");
const lampTexture = textureLoader.load("./textures/gradients/lamp.jpg");

// matcaps textures
const matcapTexture = textureLoader.load("./textures/matcaps/3.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Environment Mapping
 */

/**
 * load cube map texture
 */
// const baseUrl = "./textures/environmentMap/cube/";
// const cubeTextures = [
//   `${baseUrl}posx.jpg`,
//   `${baseUrl}negx.jpg`,
//   `${baseUrl}posy.jpg`,
//   `${baseUrl}negy.jpg`,
//   `${baseUrl}posz.jpg`,
//   `${baseUrl}negz.jpg`,
// ];
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
// const cubeMap = cubeTextureLoader.load(cubeTextures, (texture) => {});
// cubeMap.mapping = THREE.CubeReflectionMapping;
// scene.background = cubeMap;

/**
 * load jpeg texture
 */
// const envMap = textureLoader.load(
//   "./textures/environmentMap/4k.jpg",
//   (texture) => {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     // scene.background = texture;
//     // scene.environment = texture;
//   }
// );

/**
 * load .hdr texture
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

/**
 * loading .exr texture
 */
// const exrLoader = new EXRLoader();
// exrLoader.load("./textures/environmentMap/meadow_4k.exr", (texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = texture;
//   scene.environment = texture;
// });

/**
 * iridescenceThickness texture
 */
// const iridescenceTexture = textureLoader.load(
//   "./textures/iridescence/test.jpg"
// );

/**
 * Meshes
 */

/**
 * MeshBasicMaterial
 */
// const material = new THREE.MeshBasicMaterial({
//   map: colorTexture,
//   side: THREE.DoubleSide,
// });
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = alphaTexture;

/**
 * MeshNormalMaterial
 */
// const material = new THREE.MeshNormalMaterial({
//   side: THREE.DoubleSide,
// });

/**
 * MeshMatcapMaterial
 */
// const material = new THREE.MeshMatcapMaterial({
//   // side: THREE.DoubleSide,
// });
// material.matcap = matcapTexture;

/**
 * MeshDepthMaterial
 */
// const material = new THREE.MeshDepthMaterial();

/**
 * MeshLambertMaterial
 */
// const material = new THREE.MeshLambertMaterial();

/**
 * MeshPhongMaterial
 */
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.shininess = 1000;
// material.specular = new THREE.Color("#ff0000");
// material.envMap = envMap;

/**
 * MeshToonMaterial
 */
// const material = new THREE.MeshToonMaterial({ color: 0xffff00 });
// lampTexture.magFilter = THREE.NearestFilter;
// lampTexture.minFilter = THREE.NearestFilter;
// lampTexture.generateMipmaps = false;
// material.gradientMap = lampTexture;

/**
 * MeshStandardMaterial
 */
// const material = new THREE.MeshStandardMaterial();
// material.color = new THREE.Color(0xffffff);
// material.transparent = true;

// material.map = colorTexture;
// material.normalMap = normalTexture;
// material.normalScale.set(0, 0);

// // ao
// material.aoMap = ambientOcclusionTexture;

// // displacement
// material.displacementMap = heightTexture;
// material.displacementScale = 0;

// // metalness
// material.metalnessMap = metalnessTexture;
// material.metalness = 1;

// // roughness
// material.roughnessMap = roughnessTexture;
// material.roughness = 1;

// // alpha
// material.alphaMap = alphaTexture;

/**
 * MeshPhysicalMaterial
 */

const material = new THREE.MeshPhysicalMaterial();
material.color = new THREE.Color(0xffffff);
// material.transparent = true;

// material.map = colorTexture;
// material.normalMap = normalTexture;
material.normalScale.set(0, 0);

// ao
// material.aoMap = ambientOcclusionTexture;

// displacement
// material.displacementMap = heightTexture;
material.displacementScale = 0;

// metalness
// material.metalnessMap = metalnessTexture;
material.metalness = 1;

// roughness
// material.roughnessMap = roughnessTexture;
material.roughness = 1;

// alpha
// material.alphaMap = alphaTexture;

/**
 * Debug UI
 */
const gui = new GUI();
gui.add(material, "metalness").min(0.0).max(1.0);
gui.add(material, "roughness").min(0.0).max(1.0);
gui.add(material, "aoMapIntensity").min(0.0).max(5.0);
gui.add(material, "displacementScale").min(0.0).max(5.0);
gui.add(material.normalScale, "x").min(0.0).max(5.0).name("normalScale x");
gui.add(material.normalScale, "y").min(0.0).max(5.0).name("normalScale y");
// gui.add(material, "clearcoat").min(0.0).max(1.0);
// gui.add(material, "clearcoatRoughness").min(0.0).max(1.0);
gui.add(material, "sheen").min(0).max(1);
gui.add(material, "sheenRoughness").min(0).max(1);
gui.addColor(material, "sheenColor");
gui.add(material, "iridescence").min(0).max(2.0);
gui.add(material, "iridescenceIOR").min(0).max(10);
gui.add(material.iridescenceThicknessRange, "0").min(0).max(800);
gui.add(material.iridescenceThicknessRange, "1").min(0).max(1500);
gui.add(material, "transmission").min(0).max(5);
gui.add(material, "ior").min(0).max(50);
gui.add(material, "thickness").min(0).max(100);

// Plane Object
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
const planeMesh = new THREE.Mesh(planeGeometry, material);
// scene.add(planeMesh);
planeMesh.rotation.y = 0.5 * Math.PI;

// Sphere Object
const spheaeGemetry = new THREE.SphereGeometry(0.5, 64, 64);
const sphereMesh = new THREE.Mesh(spheaeGemetry, material);
sphereMesh.position.x = -1.5;
scene.add(sphereMesh);

//  Torus Object
const torusGeomtry = new THREE.TorusGeometry(0.3, 0.2, 64, 128);
const torusMesh = new THREE.Mesh(torusGeomtry, material);
torusMesh.position.x = 1.5;
// scene.add(torusMesh);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 1);
const pointLight = new THREE.PointLight("#ffffff", 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// pointLight.position.x = -1.5;
// pointLight.position.y = 5;
// pointLight.position.z = 0;
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper);
// scene.add(ambientLight, pointLight);

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

  // Update Meshes
  // planeMesh.rotation.x = -0.15 * elapsedTime;
  // sphereMesh.rotation.x = -0.15 * elapsedTime;
  // torusMesh.rotation.x = -0.15 * elapsedTime;

  // planeMesh.rotation.y = 0.1 * elapsedTime;
  // sphereMesh.rotation.y = 0.1 * elapsedTime;
  // torusMesh.rotation.y = 0.1 * elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
