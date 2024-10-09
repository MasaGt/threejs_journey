import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

/**
 * Base
 */

// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// AxesHelper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Directional Light
// const directionalLight = new THREE.DirectionalLight(0x00fffc, 1);
// directionalLight.position.set(1, 0, 0);
// const targetPoint = new THREE.Object3D();
// targetPoint.position.set(1, 0, 0);
// scene.add(targetPoint);
// directionalLight.target = targetPoint;
// scene.add(directionalLight);

// Hemisphere Light
// const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 1);
// scene.add(hemisphereLight);

// Point Light
// const pointLight = new THREE.PointLight(0xffff00, 1);
// pointLight.position.set(1, 1, 0);
// scene.add(pointLight);

// RectArea Light
// const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 3, 3);
// const rectAreaLight = new THREE.RectAreaLight(0xffffff, 1.0, 5, 5);
// rectAreaLight.position.set(2, 2, 2);
// rectAreaLight.lookAt(2, 0, 0);
// rectAreaLight.rotation.y = Math.PI * 0.5;
// scene.add(rectAreaLight);
// const rectLightHelper = new RectAreaLightHelper(rectAreaLight);
// rectAreaLight.add(rectLightHelper);

// Spot Light
const spotLight = new THREE.SpotLight(0x00ff00, 5, 5, Math.PI * 0.1, 0.25, 1);
// spotLight.position.set(0, 2, 0);
spotLight.target.position.set(0, -5, 0);
scene.add(spotLight.target);
scene.add(spotLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

/**
 * Debug GUI
 */
// ambientLight Debug
// const guiAmbientLight = gui.addFolder("AmbientLight");
// guiAmbientLight.addColor(ambientLight, "color");
// guiAmbientLight.add(ambientLight, "intensity").min(0).max(10);

// pointLight debug
// const guiPointLight = gui.addFolder("PointLight");
// guiPointLight.add(pointLight, "distance").min(-10).max(10);
// guiPointLight.add(pointLight, "decay").min(-10).max(10);

// rectAreaLight debug
// const helperConfig = {
//   on: true,
// };
// const guiRectAreaLight = gui.addFolder("RectAreaLight");
// guiRectAreaLight.add(rectAreaLight, "width").min(0).max(10);
// guiRectAreaLight.add(rectAreaLight, "height").min(0).max(10);
// gui.add(helperConfig, "on").onChange((on) => {
//   console.log(rectAreaLight.children);
//   const helper = rectAreaLight.getObjectByProperty(
//     "type",
//     "RectAreaLightHelper"
//   );

//   if (on) {
//     // helperが設定されていなかったら
//     if (helper == undefined) {
//       // helperを追加
//       rectAreaLight.add(rectLightHelper);
//     }
//   } else {
//     // helperが設定されていたら
//     if (helper != undefined) {
//       // helperを削除
//       helper.removeFromParent();
//     }
//   }
// });

// Spot Light Debug
const helperUpdate = () => {
  spotLightHelper.update();
};
const guiSpotLight = gui.addFolder("SpotLight");
guiSpotLight.addColor(spotLight, "color").onChange(() => {
  helperUpdate();
});
guiSpotLight.add(spotLight, "intensity").min(0).max(10);
guiSpotLight
  .add(spotLight, "distance")
  .min(-10)
  .max(10)
  .onChange(() => {
    helperUpdate();
  });
guiSpotLight
  .add(spotLight, "angle")
  .min(0)
  .max(Math.PI / 2)
  .onChange(() => {
    helperUpdate();
  });
guiSpotLight
  .add(spotLight, "penumbra")
  .min(0)
  .max(1)
  .onChange(() => {
    helperUpdate();
  });
guiSpotLight
  .add(spotLight, "decay")
  .min(-10)
  .max(10)
  .onChange(() => {
    helperUpdate();
  });
guiSpotLight
  .add(spotLight.position, "x")
  .min(-10)
  .max(10)
  .onChange(() => {
    helperUpdate();
  });
guiSpotLight
  .add(spotLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.01)
  .onChange(() => {
    helperUpdate();
  });
guiSpotLight
  .add(spotLight.position, "z")
  .min(-10)
  .max(10)
  .onChange(() => {
    helperUpdate();
  });
// helperUpdate();

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.0;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

// pointing spot light to sphere
// spotLight.target = sphere;
// scene.add(spotLight.target);
// helperUpdate();

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

// scene.add(sphere, cube, torus, plane);
scene.add(plane);

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
// camera.position.x = 1;
// camera.position.y = 1;
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

  // Update objects
  //   sphere.rotation.y = 0.1 * elapsedTime;
  //   cube.rotation.y = 0.1 * elapsedTime;
  //   torus.rotation.y = 0.1 * elapsedTime;

  //   sphere.rotation.x = 0.15 * elapsedTime;
  //   cube.rotation.x = 0.15 * elapsedTime;
  //   torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
